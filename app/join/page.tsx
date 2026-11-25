import { TextPage } from "@/components/TextPage";
import { SITE } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "掲載を希望するブリーダーの方へ（取材のご案内）",
  description: `${SITE.name}での取材・掲載を希望するブリーダーの方へのご案内です。`,
  path: "/join/",
});

export default function JoinPage() {
  return (
    <TextPage
      crumbs={[{ href: "/join/", label: "掲載を希望するブリーダーの方へ" }]}
      title="掲載を希望するブリーダーの方へ"
      lead={<p>読んだ人が「この人に会いに行きたい」と思えるブリーダーを見つけられるように、親と子の育て方と人柄を、ご本人の言葉で届けたいと考えています。</p>}
    >
      <section aria-labelledby="who">
        <h2 id="who">取材をお願いしたい方</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>第一種動物取扱業（販売）の登録があり、犬や猫を自分のところで繁殖して、迎える人に直接引き渡している方。</li>
          <li>見学を受けていて、親と、子が育つ場所を見せている方。</li>
          <li>犬種・猫種や、頭数の多さ、経験の年数は問いません。ショーの成績や血統も問いません。</li>
        </ul>
      </section>

      <section aria-labelledby="flow">
        <h2 id="flow">取材の流れ</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>お問い合わせフォームからご連絡ください。犬舎・猫舎の名前と、ご連絡先をお書き添えください。</li>
          <li>オンラインでお話を伺い、原稿にまとめます。</li>
          <li>原稿をご確認いただいてから公開します。</li>
        </ol>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">ご連絡先</h2>
        <p>
          <a href={SITE.contactUrl} target="_blank" rel="noopener" className="link">
            お問い合わせフォーム
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </p>
      </section>
    </TextPage>
  );
}
