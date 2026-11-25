import Link from "next/link";
import { notFound } from "next/navigation";
import { ListPage } from "@/components/ListPage";
import { AREA_INDEX_MIN } from "@/data/site";
import { pageMeta } from "@/lib/meta";
import { breedersOfConcern, getAllConcerns } from "@/lib/concerns-index";
import { toSummary } from "@/lib/view";

type Props = { params: Promise<{ concern: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // まだ取材していない相談のページも作る（「これから取材します」と出す。少ないうちは noindex）
  return getAllConcerns().map((s) => ({ concern: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { concern: concernSlug } = await params;
  const concern = getAllConcerns().find((s) => s.slug === concernSlug);
  if (!concern) return {};
  return pageMeta({
    title: `「${concern.label}」の相談を受けるブリーダー`,
    description: `「${concern.label}」の相談をよく受けるブリーダーのインタビュー。親と子の育て方と人柄を、本人の言葉で紹介しています。`,
    path: `/concern/${concern.slug}/`,
    // 薄いページを増やさないため、少ないうちはインデックスさせない
    noindex: concern.count < AREA_INDEX_MIN,
  });
}

export default async function ConcernPage({ params }: Props) {
  const { concern: concernSlug } = await params;
  const concern = getAllConcerns().find((s) => s.slug === concernSlug);
  if (!concern) notFound();
  return (
    <ListPage
      crumbs={[
        { href: "/concern/", label: "相談からさがす" },
        { href: `/concern/${concern.slug}/`, label: concern.label },
      ]}
      title={concern.label}
      lead={
        <p>
          {concern.lead}
          育て方も考え方も、人によって違います。それぞれのインタビューで確かめてください。
        </p>
      }
      people={breedersOfConcern(concern.slug).map(toSummary)}
    >
      {concern.count === 0 && (
        <div className="card p-10 text-center">
          <p className="font-bold">この相談を受けるブリーダーは、これから取材します。</p>
          <p className="mt-2 text-sm text-sub">
            <Link href="/breeder/" className="link">
              すべてのブリーダーを見る
            </Link>
          </p>
        </div>
      )}
    </ListPage>
  );
}
