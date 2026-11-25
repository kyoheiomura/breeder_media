/** サイト名はここだけで決める（いまは仮の名前）。変えるときは NAME・NAME_EN・KANA を直せば全ページに反映される */
const NAME = "oyamoto";
/** OGP などに添えるローマ字の表記 */
const NAME_EN = "oyamoto";
/** ロゴに小さく添える読み */
const KANA = "おやもと";
const KIND = "ブリーダーメディア";

export const SITE = {
  name: NAME,
  nameEn: NAME_EN,
  kana: KANA,
  /** title の末尾などに添える種別 */
  kind: KIND,
  /** ロゴの横に添える、何のメディアかの一言 */
  descriptor: "ブリーダーのインタビューメディア",
  /** コンセプト。トップとフッター・OGP で使う */
  tagline: ["育てたのは、", "どんな人だろう。"],
  /** トップの最初の画面の、ふきだしに入れるひとこと */
  heroMessage: "会いに行くまえに、まずは読んでみてね。",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyamoto-breeder.example").replace(/\/$/, ""),
  /** トップの title。ほかのページは titleSuffix を付ける */
  defaultTitle: `${NAME}｜会いに行きたいブリーダーが見つかる${KIND}`,
  titleSuffix: `｜${NAME} ${KIND}`,
  description:
    "oyamoto（おやもと）は、犬や猫のブリーダー一人ひとりに話を聞き、親と子の育て方と人柄を本人の言葉で届けるメディアです。見学のしかたやお迎えまでの流れ、犬舎・猫舎の情報もあわせて載せています。",
  /** お問い合わせ・取材の希望の窓口（運営会社のフォーム） */
  contactUrl: "https://0450.co.jp/contact",
  /** 掲載中のブリーダー・犬舎がダミーのあいだは true。robots.txt で全面ブロックする */
  isDummyContent: true,
} as const;

/** 1ページに並べるブリーダーの数 */
export const PAGE_SIZE = 24;
/** エリアページ・相談ページをインデックスさせる最少人数 */
export const AREA_INDEX_MIN = 3;
