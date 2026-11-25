/**
 * 個別ページ「〇〇さんの育て方」に載せる項目の並びと書き方（components/CompareFieldsList.tsx）。
 * kind: short = 短い値／long = 文章／list = 箇条書き
 * 値に優劣の色付けはしない。
 */
import type { BreederCompareData } from "@/lib/view";

export type FieldValue = string | string[];
export type CompareField = {
  key: string;
  label: string;
  kind: "short" | "long" | "list";
  get: (d: BreederCompareData) => FieldValue;
};
export type CompareGroup = { key: string; label: string; fields: CompareField[] };

const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    key: "person",
    label: "人",
    fields: [
      { key: "concerns", label: "よく受ける相談", kind: "list", get: (d) => d.concernLabels },
      {
        key: "qualifications",
        label: "資格・所属",
        kind: "list",
        get: (d) => (d.qualifications.length ? d.qualifications : ["特になし"]),
      },
      { key: "years", label: "ブリーダー歴", kind: "short", get: (d) => `${d.years}年` },
      { key: "why", label: "ブリーダーになったきっかけ", kind: "long", get: (d) => d.compare.why },
    ],
  },
  {
    key: "belief",
    label: "考え",
    fields: [
      { key: "belief", label: "いちばん大切にしていること", kind: "long", get: (d) => d.compare.belief },
      { key: "parents", label: "親との向き合い方", kind: "long", get: (d) => d.compare.parents },
      { key: "retire", label: "繁殖を終えた親の暮らし", kind: "long", get: (d) => d.compare.retire },
      { key: "message", label: "迎える人へのメッセージ", kind: "long", get: (d) => `「${d.compare.message}」` },
      { key: "notFor", label: "お断りすることがあるケース", kind: "long", get: (d) => d.compare.notFor },
    ],
  },
  {
    key: "raise",
    label: "育て方",
    fields: [
      { key: "feature", label: "特徴", kind: "long", get: (d) => d.compare.feature },
      { key: "breeds", label: "育てている犬種・猫種", kind: "list", get: (d) => d.compare.breeds },
      { key: "scale", label: "親の頭数と出産の回数", kind: "long", get: (d) => d.compare.scale },
      { key: "raising", label: "子が育つ場所", kind: "short", get: (d) => d.compare.raising },
      { key: "health", label: "検査・健康管理", kind: "list", get: (d) => d.compare.health },
      { key: "socialization", label: "お迎えまでの過ごさせ方", kind: "long", get: (d) => d.compare.socialization },
    ],
  },
  {
    key: "welcome",
    label: "見学からお迎えまで",
    fields: [
      { key: "meet", label: "見学で会える相手", kind: "short", get: (d) => d.compare.meet },
      { key: "tour", label: "見学で見られる場所", kind: "short", get: (d) => d.compare.tour },
      { key: "visitMin", label: "はじめての見学の時間", kind: "short", get: (d) => `${d.compare.visitMin}分ほど` },
      { key: "matching", label: "どの子を迎えるかの決め方", kind: "long", get: (d) => d.compare.matching },
      {
        key: "handoverAge",
        label: "お迎えの時期",
        kind: "short",
        get: (d) => `生後${d.compare.handover.ageDays}日を過ぎてから`,
      },
      { key: "handoverIncludes", label: "お迎えのときに渡すもの", kind: "list", get: (d) => d.compare.handover.includes },
      { key: "follow", label: "迎えたあとの連絡", kind: "short", get: (d) => d.compare.follow },
      {
        key: "takeback",
        label: "飼えなくなったときの相談",
        kind: "short",
        get: (d) => (d.compare.takeback ? "受けている" : "受けていない"),
      },
      { key: "worries", label: "よく受ける心配ごと", kind: "list", get: (d) => d.compare.worryLabels },
    ],
  },
  {
    key: "access",
    label: "犬舎・猫舎",
    fields: [
      { key: "venue", label: "名前", kind: "list", get: (d) => d.venues.map((c) => c.name) },
      { key: "kind", label: "かたち", kind: "short", get: (d) => d.venues.map((c) => c.kind).join("／") },
      { key: "area", label: "場所・行き方", kind: "long", get: (d) => d.venues.map((c) => `${c.area}　${c.access}`) },
      { key: "hours", label: "見学できる日と時間", kind: "long", get: (d) => d.venues.map((c) => c.hours) },
      {
        key: "features",
        label: "見学のときのこと",
        kind: "list",
        get: (d) => (d.features.length ? d.features : ["特になし"]),
      },
      { key: "license", label: "動物取扱業の登録", kind: "long", get: (d) => d.venues.map((c) => c.license) },
      { key: "gender", label: "ブリーダーの性別", kind: "short", get: (d) => d.gender ?? "非公開" },
      {
        key: "price",
        label: "子犬・子猫の価格（税込）",
        kind: "long",
        get: (d) =>
          [`${yen(d.compare.price.min)}〜${yen(d.compare.price.max)}`, d.compare.price.note].filter((v): v is string => Boolean(v)),
      },
    ],
  },
];
