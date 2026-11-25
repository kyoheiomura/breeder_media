import { PageHero } from "@/components/PageHero";
import { BreederBrowser } from "@/components/BreederBrowser";
import { getAreaTree } from "@/lib/areas-index";
import { getAllBreeders } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { toSummary } from "@/lib/view";

export const metadata = pageMeta({
  title: "ブリーダーをさがす（インタビュー一覧）",
  description:
    "取材したブリーダーの一覧です。相談・エリア・心配ごとで絞り込んで、気になるブリーダーのインタビューを読めます。",
  path: "/breeder/",
});

export default function BreederListPage() {
  const people = getAllBreeders().map(toSummary);
  const areas = getAreaTree().map((p) => ({
    slug: p.slug,
    name: p.name,
    cities: p.cities.map((c) => ({ slug: c.slug, name: c.name })),
  }));

  return (
    <>
      <PageHero
        crumbs={[{ href: "/breeder/", label: "ブリーダーをさがす" }]}
        title="ブリーダーをさがす"
        lead={`${people.length}人のブリーダーに話を聞きました。相談やエリアで絞り込んで、気になる人から読んでみてください。`}
      />
      <div className="container-page pt-10 min-[768px]:pt-14">
        <div>
          <BreederBrowser people={people} areas={areas} />
        </div>
      </div>
    </>
  );
}
