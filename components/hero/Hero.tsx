import Image from "next/image";
import Link from "next/link";
import { Paw, Sparkle } from "@/components/Doodles";
import { SITE } from "@/data/site";

/*
 * トップの最初の画面。tocotoco（左に見出し・右に丸い写真）とは変えて、見出しを中央に置く。
 * 写真は親と子の場面（PHOTOS）で、下の「新しいインタビュー」の人物写真とは重ねない。
 */
type Css = React.CSSProperties;
const i = (n: number) => ({ "--i": n }) as Css;

/** 実際の取材写真に入れ替えるときは、ここを選び直す（丸やアーチに切り抜かれるので、主役が中央から下にある写真を選ぶ） */
const PHOTOS = {
  kittens: { src: "/images/top/hero-kittens.jpg", caption: "きょうだいと", alt: "かごのなかで寄りそう、青い目のラグドールの子猫2頭", pos: "50% 60%" },
  mother: { src: "/images/top/hero-mother.jpg", caption: "母犬のそばで", alt: "毛布の上で、母犬のおなかに寄りそって眠るダックスフンドの子犬たち", pos: "50% 60%" },
  outside: { src: "/images/top/hero-outside.jpg", caption: "はじめての外へ", alt: "芝生の上を、母犬に見守られて歩くゴールデン・レトリーバーの子犬", pos: "50% 60%" },
  note: { src: "/images/interview/mihon-haruka-note.jpg", caption: "", alt: "", pos: "36% 50%" },
  yard: { src: "/images/interview/kari-daichi-yard.jpg", caption: "", alt: "", pos: "50% 60%" },
};
const THREE = [PHOTOS.kittens, PHOTOS.mother, PHOTOS.outside];

/** 見出しの文字を1字ずつに分ける。--c は出る順番（0 から） */
function Chars({ text, from }: { text: string; from: number }) {
  return (
    <>
      {[...text].map((ch, n) => (
        <span key={n} className="char" style={{ "--c": from + n } as Css}>
          {ch}
        </span>
      ))}
    </>
  );
}

/*
 * 見出しの出方：1字ずつ、下から傾いてはずみながら順に出る → 「どんな人」に黄色のマーカーが引かれる
 * → マーカーの文字が小さくうなずく → 最後の「。」がぽんと落ちる。説明文・ボタン・下の写真は、見出しとほぼ同時に出はじめる。
 * 読み上げは h1 の aria-label にまかせ、1字ずつの span は飾りとして扱う。
 */
function Title({ titleId }: { titleId: string }) {
  const [l1, l2] = SITE.tagline; // 「育てたのは、」「どんな人だろう。」
  const mark = "どんな人";
  const rest = l2.replace(mark, "").replace(/。$/, "");
  return (
    <h1 id={titleId} aria-label={`${l1}${l2}`} className="text-[clamp(2.125rem,1.1rem+4.2vw,4rem)] leading-[1.3] font-extrabold">
        <span aria-hidden="true" className="inline-block whitespace-nowrap">
          <Chars text={l1} from={0} />
        </span>
        <span aria-hidden="true" className="inline-block whitespace-nowrap">
          <span className="marker marker-draw hero-marker">
            <Chars text={mark} from={l1.length} />
          </span>
          <Chars text={rest} from={l1.length + mark.length} />
          <span className="char char-dot" style={{ "--c": l1.length + mark.length + rest.length } as Css}>
            。
          </span>
      </span>
    </h1>
  );
}

/** 説明文とボタン。狭い画面では写真の下、広い画面では見出しのすぐ下に置く */
function Body({ className }: { className: string }) {
  return (
    <div className={className}>
      <p className="pop-in mx-auto max-w-[34rem] text-left leading-[2.05] min-[640px]:text-center" style={i(3)}>
        {SITE.name}
        は、ブリーダーさん本人に話を聞いたインタビューメディアです。どんな人が、どんな考えで親と子を育てているのか。会いに行く前に、じっくり読めます。
      </p>
      <div className="pop-in mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4" style={i(4.5)}>
        <Link href="/breeder/" className="btn-primary">
          ブリーダーさんの話を読む
        </Link>
        <Link href="#concerns" className="link-quiet">
          相談からさがす
        </Link>
      </div>
    </div>
  );
}

/** サイトからのひとこと。変えるときは data/site.ts の heroMessage */
function Bubble({ className }: { className: string }) {
  return (
    <p className={`bubble phrase absolute hidden px-5 py-3.5 text-left text-[0.8125rem] leading-[1.7] font-bold ${className}`}>
      {SITE.heroMessage}
    </p>
  );
}

/**
 * ポップでかわいく、ぎゅっと詰まった感じに。
 * ピーチの丘の上に、少し傾けたアーチの窓を3つ。すきまに丸い小窓を2つはさみ、黄色い札・ふきだし・
 * きらきら・足あとを、シールを貼るように重ねる。
 */
export function Hero({ titleId = "hero-title" }: { titleId?: string }) {
  return (
    <section aria-labelledby={titleId} className="relative overflow-x-clip pb-12 min-[900px]:pb-20">
      {/* 狭い画面：見出し → 写真 → 説明文とボタン（開いてすぐ、写真まで見えるように）。広い画面：見出し → 説明文とボタン → 写真 */}
      <div className="container-page flex flex-col pt-7 text-center min-[900px]:pt-14">
        <Title titleId={titleId} />
        <Body className="order-3 mt-9 min-[768px]:order-2 min-[768px]:mt-5 min-[900px]:mt-6" />
        <div className="relative order-2 -mx-2 mt-9 pb-8 min-[768px]:order-3 min-[768px]:mx-auto min-[768px]:mt-14 min-[768px]:w-full min-[768px]:max-w-[60rem] min-[768px]:pb-10 min-[900px]:mt-20 min-[900px]:pb-14">
          {/* 丘と、そのうしろからのぞく色の丸 */}
          <div aria-hidden="true" className="pop-in absolute bottom-0 left-1/2 h-[60%] w-[124%] max-w-[100vw] -translate-x-1/2 min-[900px]:max-w-none" style={i(0.5)}>
            <div className="absolute -top-[9%] left-[9%] aspect-square w-[11%] rounded-full bg-yellow" />
            <div className="absolute -top-[4%] right-[7%] aspect-square w-[7%] rounded-full bg-peach" />
            <div className="relative size-full rounded-t-[999px] rounded-b-[2rem] bg-blanket min-[900px]:rounded-b-[2.5rem]" />
          </div>

          <ul className="relative grid grid-cols-[1fr_1.12fr_1fr] items-end gap-2.5 px-[1%] min-[640px]:gap-7 min-[900px]:gap-11 min-[900px]:px-[7%]">
            {THREE.map((h, n) => (
              <li key={h.src} className="pop-scale relative" style={i(1.5 + n)}>
                <div className={`relative ${n === 0 ? "-rotate-3" : n === 2 ? "rotate-3" : ""}`}>
                  {n === 1 && <div aria-hidden="true" className="absolute top-2 left-2 size-full rounded-t-[999px] rounded-b-[1.25rem] bg-peach min-[900px]:top-4 min-[900px]:left-4 min-[900px]:rounded-b-[2rem]" />}
                  <div className={`relative overflow-hidden rounded-t-[999px] rounded-b-[1.25rem] bg-paper min-[900px]:rounded-b-[2rem] ${n === 1 ? "aspect-[3/4.3]" : "aspect-[3/4]"}`}>
                    <Image src={h.src} alt={h.alt} fill priority sizes="(min-width: 900px) 300px, 34vw" className="object-cover" style={{ objectPosition: h.pos }} />
                  </div>
                  {/* 黄色い札。シールのように少し傾ける */}
                  <p aria-hidden="true" className={`absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow px-2.5 py-0.5 text-[0.625rem] leading-[1.9] font-extrabold whitespace-nowrap min-[640px]:px-5 min-[640px]:text-[0.875rem] min-[900px]:-bottom-4 min-[900px]:py-1 ${n === 1 ? "-rotate-2" : "rotate-2"}`}>
                    {h.caption}
                  </p>
                </div>
                {n === 0 && <Bubble className="-top-14 -left-28 max-w-[13.5rem] min-[1100px]:block" />}
              </li>
            ))}
          </ul>

          {/* すきまにはさむ、丸い小窓 */}
          <div className="pop-scale absolute bottom-[4%] left-[27%] hidden aspect-square w-[13%] min-[640px]:block" style={i(5)}>
            <div className="relative size-full overflow-hidden rounded-full border-4 border-foam bg-blanket min-[900px]:border-[6px]">
              <Image src={PHOTOS.note.src} alt="" fill sizes="140px" className="object-cover" style={{ objectPosition: PHOTOS.note.pos }} />
            </div>
          </div>
          <div className="pop-scale absolute top-[30%] right-[-3%] hidden aspect-square w-[14%] min-[640px]:block min-[900px]:top-[34%] min-[900px]:right-[-5%] min-[900px]:w-[12%]" style={i(6)}>
            <div className="relative size-full overflow-hidden rounded-full border-4 border-foam bg-blanket min-[900px]:border-[6px]">
              <Image src={PHOTOS.yard.src} alt="" fill sizes="140px" className="object-cover" style={{ objectPosition: PHOTOS.yard.pos }} />
            </div>
          </div>

          <Sparkle className="sway absolute top-[-6%] right-[4%] size-6 text-yellow min-[900px]:size-9" />
          <Sparkle className="sway absolute top-[-9%] left-[36%] size-4 text-peach [animation-delay:-1.5s] min-[900px]:size-6" />
          <Sparkle className="sway absolute bottom-[26%] right-[30%] size-4 text-yellow [animation-delay:-3s] min-[900px]:size-5" />
          <Paw className="sway absolute bottom-[34%] left-[-2%] size-5 -rotate-12 [animation-delay:-2s] min-[900px]:left-[-5%] min-[900px]:size-8" />
        </div>
      </div>
    </section>
  );
}
