import { PageHero } from "@/components/PageHero";
import { ConcernDirectory } from "@/components/ConcernDirectory";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "相談からブリーダーを探す",
  description: "取材したブリーダーを、はじめて迎える・親や育つ場所を見たい・健康や遺伝の検査・迎えたあとの相談など、相談したいことから探せます。",
  path: "/concern/",
});

export default function ConcernIndexPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/concern/", label: "相談からさがす" }]}
        title="相談からさがす"
        lead="その相談をよく受けているブリーダーを、相談ごとにまとめています。数字は、話を聞いた人数です。"
      />
      <div className="container-page pt-10 min-[768px]:pt-14">
        <div>
          <ConcernDirectory headingLevel="h2" />
        </div>
      </div>
    </>
  );
}
