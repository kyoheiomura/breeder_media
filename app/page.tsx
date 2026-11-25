import Image from "next/image";
import Link from "next/link";
import { ConcernDirectory } from "@/components/ConcernDirectory";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/JsonLd";
import { SectionHead } from "@/components/SectionHead";
import { SampleNote, BreederGrid } from "@/components/BreederCard";
import { SITE } from "@/data/site";
import { getAreaTree } from "@/lib/areas-index";
import { getAllBreeders } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { toSummary } from "@/lib/view";

/*
 * トップ。読みたくなる入口を、上から順に置く。
 * 見出しと写真 → ブリーダーさんのことば（本文から抜き出した一文）→ 新しいインタビュー
 * → 相談からさがす → 使い方 → 迎える前に知っておきたい決まり → エリア → ブリーダーの方へ
 */
export const metadata = pageMeta({ absoluteTitle: SITE.defaultTitle, path: "/" });

/** 使い方。実際に順番のある手順なので番号を付ける */
const STEPS = [
  { verb: "読む", body: "ブリーダーになったきっかけ、親と子の育て方、どんな人に迎えてほしいか。本人の言葉を、3つの章にまとめています。" },
  { verb: "確かめる", body: "見学で会える相手、受けさせている検査、お迎えの時期、迎えたあとの連絡、動物取扱業の登録。会いに行く前に知りたいことも、同じページにあります。" },
  { verb: "会いに行く", body: `会ってみたい人が決まったら、記事の最後にある窓口から見学を申し込みます。${SITE.name}は、子犬や子猫の販売・仲介をしていません。` },
];

/** 迎える人が見学のときに確かめられる、法律の決まり（動物の愛護及び管理に関する法律） */
const RULES = [
  { title: "会って、説明を受けてから", body: "ブリーダーは、迎える人に実物の子犬・子猫を見せ、事業所で顔を合わせて説明することになっています。会わないまま迎えることはできません。" },
  { title: "生後56日を過ぎてから", body: "生まれて56日を過ぎるまでは、子犬・子猫を引き渡せません。お迎えの時期は、各ブリーダーのページに書いています。" },
  { title: "登録のある人から", body: "犬や猫を売るには、第一種動物取扱業の登録が必要です。登録番号は、各ブリーダーのページの最後に載せています。" },
];

export default function Home() {
  const all = getAllBreeders();
  const cards = all.slice(0, 3).map(toSummary);
  const prefs = getAreaTree();

  return (
    <>
      <Hero />

      <section aria-labelledby="voices" className="reveal reveal-soft mx-3 overflow-hidden rounded-[2rem] bg-blanket py-12 min-[768px]:mx-6 min-[768px]:rounded-[2.5rem] min-[768px]:py-20">
        <div className="container-page">
          <SectionHead id="voices" en="Voices" voice title="ブリーダーさんの、ことば" lead="インタビューの途中で、思わず手が止まったひとこと。つづきは記事で読めます。" />
          <ul className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] min-[900px]:mx-0 min-[900px]:mt-10 min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:gap-8 min-[900px]:overflow-visible min-[900px]:px-0 [&::-webkit-scrollbar]:hidden">
            {cards
              .filter((s) => s.hook)
              .map((s) => (
                <li key={s.slug} className="reveal reveal-pop flex w-[84%] shrink-0 snap-center flex-col min-[900px]:w-auto">
                  <p className="bubble phrase flex-1 px-6 py-6 text-[1rem] leading-[1.9] font-bold min-[900px]:px-7 min-[900px]:py-7 min-[900px]:text-[1.0625rem]">「{s.hook}」</p>
                  <Link href={`/breeder/${s.slug}/`} className="group mt-6 flex items-center gap-4 pl-3">
                    <span className="relative block size-14 shrink-0 overflow-hidden rounded-full bg-paper">
                      <Image src={s.photo.src} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="text-[0.8125rem] leading-[1.6]">
                      <span className="block font-bold">{s.name} さん</span>
                      <span className="link-quiet !text-[0.8125rem]">つづきを読む</span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
          <p aria-hidden="true" className="mt-4 text-center text-[0.75rem] font-bold text-sub min-[900px]:hidden">← 横にスワイプできます →</p>
          <SampleNote className="mt-6 text-center min-[900px]:mt-10" />
        </div>
      </section>

      <section aria-labelledby="latest" className="container-page pt-20 min-[768px]:pt-28">
        <SectionHead id="latest" en="Interviews" title="新しいインタビュー" />
        <div className="mt-10">
          <BreederGrid people={cards} note={false} swipe />
        </div>
        <p className="reveal mt-10 text-center">
          <Link href="/breeder/" className="btn-outline">
            {all.length}人すべてを見る
          </Link>
        </p>
      </section>

      <section id="concerns" aria-labelledby="concerns-title" className="reveal reveal-soft mx-3 mt-20 scroll-mt-24 rounded-[2rem] bg-blanket py-12 min-[768px]:mx-6 min-[768px]:rounded-[2.5rem] min-[768px]:mt-28 min-[768px]:py-20">
        <div className="container-page">
          <SectionHead id="concerns-title" en="Find by concern" title="相談からさがす" lead="その相談をよく受けているブリーダーさんが並びます。数字は、話を聞いた人数です。" />
          <div className="mt-10">
            <ConcernDirectory headingLevel="h3" withLead={false} />
          </div>
        </div>
      </section>

      <section aria-labelledby="how" className="container-page pt-20 min-[768px]:pt-28">
        <SectionHead id="how" en="How to use" title={`${SITE.name}の使い方`} />
        <ol className="mt-10 grid gap-6 min-[768px]:grid-cols-3 min-[768px]:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.verb} className="reveal reveal-pop card relative p-7 pt-10">
              <span aria-hidden="true" className="num absolute -top-5 left-6 flex size-11 items-center justify-center rounded-full bg-ink text-[1.125rem] text-white">
                {i + 1}
              </span>
              <p className="text-[1.375rem] font-extrabold">{s.verb}</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.95]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="rules" className="container-page pt-20 min-[768px]:pt-28">
        <SectionHead id="rules" en="Before you visit" title="迎える前の、3つの決まり" lead="犬や猫を売る人には、法律で決められていることがあります。見学のときに、確かめてみてください。" />
        <ul className="mt-10 grid gap-6 min-[768px]:grid-cols-3 min-[768px]:gap-8">
          {RULES.map((r) => (
            <li key={r.title} className="reveal reveal-pop rounded-[var(--radius-soft)] bg-blanket p-7">
              <p className="phrase text-[1.125rem] leading-[1.6] font-extrabold">{r.title}</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.95]">{r.body}</p>
            </li>
          ))}
        </ul>
        <p className="reveal reveal-soft mt-6 text-[0.75rem] leading-[1.9] text-sub">動物の愛護及び管理に関する法律にもとづく決まりです。くわしい内容は、環境省や自治体の案内で確かめてください。</p>
      </section>

      <section aria-labelledby="area" className="container-page pt-20 min-[768px]:pt-28">
        <SectionHead id="area" en="Find by area" title="エリアからさがす" />
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {prefs.map((p) => (
            <li key={p.slug} className="reveal reveal-pop">
              <Link href={`/area/${p.slug}/`} className="flex min-h-14 items-center gap-3 rounded-full border-2 border-transparent bg-paper py-2 pr-4 pl-6 font-bold transition-colors hover:border-peach">
                {p.name}
                <span className="rounded-full bg-yellow px-2.5 text-[0.75rem] leading-[1.9]">{p.count}人</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="reveal reveal-soft mt-8 text-center">
          <Link href="/area/" className="link-quiet">
            47都道府県の一覧を見る
          </Link>
        </p>
      </section>

      <section aria-labelledby="for-breeders" className="container-page pt-20 min-[768px]:pt-28">
        <div className="reveal relative overflow-hidden rounded-[2rem] bg-peach min-[768px]:rounded-[2.5rem]">
          <div className="relative grid items-center min-[900px]:grid-cols-2 min-[900px]:gap-8">
            <div className="reveal reveal-left p-8 min-[768px]:p-14">
              <h2 id="for-breeders" className="text-[clamp(1.625rem,1.2rem+1.8vw,2.5rem)] leading-[1.5] font-extrabold">
                ブリーダーさんへ。
                <br />
                お話を聞かせてください。
              </h2>
              <p className="mt-4 max-w-[26rem] text-[0.9375rem] leading-[2]">取材を受けていただけるブリーダーさんを探しています。取材の流れをまとめました。</p>
              <Link href="/join/" className="btn-primary mt-7">
                掲載について読む
              </Link>
            </div>
            <div className="reveal reveal-right relative min-h-[13rem] self-stretch min-[900px]:min-h-[22rem]">
              <Image src="/images/top/talk.jpg" alt="居間の低いテーブルを囲んで、見学に来た人とブリーダーが話している。ダックスフンドが、差し出された手の匂いを嗅いでいる" fill sizes="(min-width: 900px) 40vw, 100vw" className="object-cover min-[900px]:rounded-l-[6rem]" />
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          alternateName: `${SITE.name} ${SITE.kind}`,
          url: `${SITE.url}/`,
          description: SITE.description,
          inLanguage: "ja",
        }}
      />
    </>
  );
}
