/**
 * 原稿の検査（npm run lint:content。npm run build の最初にも走る）
 *   1. スキーマ（Zod）と参照（場所・写真・slug）の検証 … lib/content.ts の loadContent をそのまま使う
 *   2. NG ワード（data/ng-words.ts）… error があれば終了コード 1
 *   3. 情報の鮮度 … 確認日（verifiedAt）が半年より前なら warn
 *   4. 法律まわり … 動物取扱業の登録の有効期限、引き渡しの日齢（生後56日を過ぎてから）
 */
import fs from "node:fs";
import path from "node:path";
import { NG_RULES } from "../data/ng-words";
import { loadContent } from "../lib/content";

const STALE_DAYS = 183;
type Finding = { level: "error" | "warn"; file: string; line: number; message: string };
const findings: Finding[] = [];
const rel = (f: string) => path.relative(process.cwd(), f);

// 1. スキーマ
let store: ReturnType<typeof loadContent>;
try {
  store = loadContent();
} catch (e) {
  console.error(`\n✖ ${(e as Error).message}\n`);
  process.exit(1);
}

// 2. NG ワード
function allowedOn(lines: string[], i: number) {
  const pick = (l: string | undefined) => l?.match(/ng-ok:\s*(\S+)/)?.[1];
  return [pick(lines[i]), pick(lines[i - 1])].filter((w): w is string => Boolean(w));
}

function scan(file: string) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((raw, i) => {
    // コメント行そのもの・slug や URL・画像パスは検査しない
    if (/^\s*#|^\s*\{\/\*.*\*\/\}\s*$/.test(raw)) return;
    const line = raw.replace(/https?:\/\/\S+|\/images\/\S+/g, "");
    const allowed = allowedOn(lines, i);
    for (const rule of NG_RULES) {
      const m = line.match(rule.pattern);
      if (!m || allowed.some((w) => m[0].includes(w) || w.includes(m[0]))) continue;
      findings.push({
        level: rule.level,
        file: rel(file),
        line: i + 1,
        message: `「${m[0]}」[${rule.category}] ${rule.hint}`,
      });
    }
  });
}

for (const s of store.breeder) scan(s.file);
for (const c of store.venues) scan(c.file);

// 3. 鮮度
const now = Date.now();
for (const item of [...store.breeder, ...store.venues]) {
  const days = Math.floor((now - item.verifiedAt.getTime()) / 86_400_000);
  if (days > STALE_DAYS) {
    findings.push({ level: "warn", file: rel(item.file), line: 1, message: `情報の確認から${days}日たっている（verifiedAt）。価格・見学の時間を確認し直す` });
  }
}

// 4. 法律まわり
const SOON_DAYS = 90;
for (const c of store.venues) {
  const left = Math.floor((c.license.expiresAt.getTime() - now) / 86_400_000);
  if (left < 0) {
    findings.push({ level: "error", file: rel(c.file), line: 1, message: `動物取扱業の登録の有効期限（license.expiresAt）が切れている。更新を確かめるまで掲載しない` });
  } else if (left < SOON_DAYS) {
    findings.push({ level: "warn", file: rel(c.file), line: 1, message: `動物取扱業の登録の有効期限まで${left}日。更新したかを確かめる` });
  }
  if (c.license.expiresAt <= c.license.registeredAt) {
    findings.push({ level: "error", file: rel(c.file), line: 1, message: "license: 有効期限が登録日より前になっている" });
  }
}
for (const s of store.breeder) {
  // 生後56日を過ぎるまでは引き渡せない（天然記念物に指定された日本犬を、繁殖した人が直接渡すときだけ49日）
  if (s.compare.handover.ageDays < 57) {
    findings.push({
      level: "warn",
      file: rel(s.file),
      line: 1,
      message: `お迎えの時期が生後${s.compare.handover.ageDays}日。生後56日を過ぎてからが決まり（日本犬の特例に当たるかを確かめる）`,
    });
  }
}

// 結果
const errors = findings.filter((f) => f.level === "error");
const warns = findings.filter((f) => f.level === "warn");
for (const f of [...errors, ...warns]) {
  console.log(`${f.level === "error" ? "✖ error" : "⚠ warn "}  ${f.file}:${f.line}  ${f.message}`);
}
console.log(
  `\nブリーダー ${store.breeder.length}人・犬舎・猫舎 ${store.venues.length}件を検査: error ${errors.length}件 / warn ${warns.length}件`,
);
if (errors.length > 0) {
  console.log("error を直すか、否定の文脈なら ng-ok を付けてから、もう一度実行してください。");
  process.exit(1);
}
