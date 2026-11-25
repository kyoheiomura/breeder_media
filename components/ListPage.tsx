import type { ReactNode } from "react";
import { type Crumb } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { BreederGrid } from "@/components/BreederCard";
import type { BreederSummary } from "@/lib/view";

/** 相談別・エリア別・犬舎・猫舎別など、条件が決まった静的な一覧ページの共通の形 */
export function ListPage({
  crumbs,
  title,
  lead,
  people,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lead: ReactNode;
  people: BreederSummary[];
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero crumbs={crumbs} title={title} lead={lead} />
      <div className="container-page pt-6 min-[768px]:pt-10">
        {children}
        <div className="mt-10">
          <BreederGrid people={people} headingLevel="h2" priorityCount={2} />
        </div>
      </div>
    </>
  );
}
