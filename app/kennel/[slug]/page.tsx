import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ListPage } from "@/components/ListPage";
import { SITE } from "@/data/site";
import { getAllVenues, getVenue, breedersOfVenue } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { areaOf, formatDate, hoursLabel, licenseLabel, toSummary } from "@/lib/view";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllVenues().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const c = getVenue((await params).slug);
  if (!c) return {};
  const area = areaOf(c);
  return pageMeta({
    title: `${c.name}（${area.label}）のブリーダー`,
    description: `${area.fullLabel}の「${c.name}」のブリーダーのインタビューと、場所・見学できる日・動物取扱業の登録の情報です。`,
    path: `/kennel/${c.slug}/`,
  });
}

const DAY_MAP = { 月: "Monday", 火: "Tuesday", 水: "Wednesday", 木: "Thursday", 金: "Friday", 土: "Saturday", 日: "Sunday" } as const;

export default async function VenuePage({ params }: Props) {
  const c = getVenue((await params).slug);
  if (!c) notFound();
  const area = areaOf(c);
  const people = breedersOfVenue(c.slug);

  return (
    <>
      <ListPage
        crumbs={[
          { href: `/area/${area.pref.slug}/${area.city.slug}/`, label: area.city.name },
          { href: `/kennel/${c.slug}/`, label: c.name },
        ]}
        title={`${c.name}のブリーダー`}
        lead={
          <p>
            {area.fullLabel}にあります。ここで話を聞いたブリーダーは{people.length}人です。場所と見学できる日、動物取扱業の登録は、下にまとめています。
          </p>
        }
        people={people.map(toSummary)}
      />
      <section aria-labelledby="venue-info" className="container-page pt-16 min-[768px]:pt-24">
        <h2 id="venue-info" className="reveal section-title">
          犬舎・猫舎の情報
        </h2>
        <dl className="reveal card mt-6 divide-y divide-dashed divide-line px-6 min-[768px]:px-9">
          {[
            ["場所", `${area.fullLabel}${c.address.line}${c.address.building ? ` ${c.address.building}` : ""}`],
            ["行き方", c.access],
            ["かたち", c.kind],
            ["見学できる日", hoursLabel(c) + (c.hoursNote ? `（${c.hoursNote}）` : "")],
            ["見学のときのこと", c.features.length ? c.features.join("・") : "特になし"],
            ["見学の申し込み", [c.contact.phone && `電話 ${c.contact.phone}`, c.contact.url && "公式サイト", c.contact.line && "LINE"].filter(Boolean).join("／")],
            ["動物取扱業の登録", `${licenseLabel(c)}／登録 ${formatDate(c.license.registeredAt)}／有効期限 ${formatDate(c.license.expiresAt)}／動物取扱責任者 ${c.license.manager}`],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-1 py-4 min-[768px]:grid-cols-[10rem_1fr]">
              <dt className="text-[0.8125rem] leading-[2.1] font-bold text-sub">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {c.contact.url && (
          <p className="mt-6">
            <a href={c.contact.url} target="_blank" rel="noopener" className="btn-outline">
              公式サイトで見学の申し込み方を見る
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </p>
        )}
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: c.name,
          url: `${SITE.url}/kennel/${c.slug}/`,
          telephone: c.contact.phone,
          address: {
            "@type": "PostalAddress",
            addressCountry: "JP",
            addressRegion: area.pref.name,
            addressLocality: area.city.name,
            streetAddress: c.address.line,
          },
          openingHoursSpecification: c.hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days.filter((d) => d !== "祝").map((d) => DAY_MAP[d as keyof typeof DAY_MAP]),
            opens: h.open,
            closes: h.close,
          })),
          employee: people.map((s) => ({ "@type": "Person", name: s.name, url: `${SITE.url}/breeder/${s.slug}/` })),
        }}
      />
    </>
  );
}
