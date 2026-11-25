import Link from "next/link";
import { notFound } from "next/navigation";
import { ListPage } from "@/components/ListPage";
import { AREA_INDEX_MIN } from "@/data/site";
import { getAllPrefs, breedersInPref } from "@/lib/areas-index";
import { pageMeta } from "@/lib/meta";
import { toSummary } from "@/lib/view";

type Props = { params: Promise<{ pref: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // 47都道府県すべてのページを作る（まだ取材していない県は「これから取材します」と出す。少ないうちは noindex）
  return getAllPrefs().map((p) => ({ pref: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { pref: prefSlug } = await params;
  const pref = getAllPrefs().find((p) => p.slug === prefSlug);
  if (!pref) return {};
  return pageMeta({
    title: `${pref.name}のブリーダー`,
    description: `${pref.name}のブリーダーのインタビュー。親と子の育て方と人柄を読んで、会いに行く相手を選べます。`,
    path: `/area/${pref.slug}/`,
    noindex: pref.count < AREA_INDEX_MIN,
  });
}

export default async function PrefPage({ params }: Props) {
  const { pref: prefSlug } = await params;
  const pref = getAllPrefs().find((p) => p.slug === prefSlug);
  if (!pref) notFound();
  return (
    <ListPage
      crumbs={[
        { href: "/area/", label: "エリアからさがす" },
        { href: `/area/${pref.slug}/`, label: pref.name },
      ]}
      title={`${pref.name}のブリーダー`}
      lead={pref.count > 0 ? <p>{pref.name}で話を聞いたブリーダーは{pref.count}人です（新着順）。</p> : <p>{pref.name}のブリーダーを紹介するページです。</p>}
      people={breedersInPref(pref.slug).map(toSummary)}
    >
      <ul className="flex flex-wrap gap-2">
        {pref.cities.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/area/${pref.slug}/${c.slug}/`}
              className="inline-flex min-h-11 items-center rounded-full border-2 border-peach bg-paper px-4 text-[0.875rem] font-bold hover:border-ink"
            >
              {c.name}
              <span className="ml-1 text-sub">（{c.count}）</span>
            </Link>
          </li>
        ))}
      </ul>
      {pref.count === 0 && (
        <div className="card mt-4 p-10 text-center">
          <p className="font-bold">{pref.name}のブリーダーは、これから取材します。</p>
          <p className="mt-2 text-sm text-sub">
            <Link href="/breeder/" className="link">
              ほかのエリアのブリーダーを見る
            </Link>
          </p>
        </div>
      )}
    </ListPage>
  );
}
