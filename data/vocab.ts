/**
 * 比較項目で使う決まった語彙。自由入力にすると絞り込みと比較が崩れるので、増やすときはここに足す。
 */

/**
 * 相談（サイトの主な探し方）。slug は URL（/concern/[slug]/）に使うので、公開後は変えない。
 * 並びは一覧・絞り込みの順。
 * lead は相談ページの冒頭の文。結果を約束する言い方や、健康の言い切りは書かない。
 */
export type Concern = { slug: string; label: string; short: string; lead: string };
export const CONCERNS: Concern[] = [
  {
    slug: "first",
    label: "はじめて犬や猫を迎える",
    short: "はじめて",
    lead: "はじめて迎える人に、暮らしの準備から時間をかけて話をすることが多いブリーダーたちです。",
  },
  {
    slug: "visit",
    label: "親や育つ場所を見て決めたい",
    short: "見学",
    lead: "見学のときに、親と、子が育っている場所を見せているブリーダーたちです。",
  },
  {
    slug: "health",
    label: "健康や遺伝の検査が気になる",
    short: "健康・検査",
    lead: "親に受けさせている検査と、その結果の伝え方を、見学のときに説明しているブリーダーたちです。",
  },
  {
    slug: "family",
    label: "子どもや先住の子がいる",
    short: "家族・先住",
    lead: "家族の顔ぶれや先にいる犬・猫のことを聞いたうえで、迎え方を一緒に考えるブリーダーたちです。",
  },
  {
    slug: "after",
    label: "迎えたあとも相談したい",
    short: "その後の相談",
    lead: "引き渡したあとも、食事や体調、暮らしの困りごとの相談を受けているブリーダーたちです。",
  },
  {
    slug: "small",
    label: "小型犬",
    short: "小型犬",
    lead: "小型犬を育てているブリーダーたちです。",
  },
  {
    slug: "large",
    label: "中型犬・大型犬",
    short: "中・大型犬",
    lead: "体の大きな犬を育て、成長したあとの暮らしまで話をしているブリーダーたちです。",
  },
  {
    slug: "cat",
    label: "猫",
    short: "猫",
    lead: "猫を育てているブリーダーたちです。",
  },
];
export const CONCERN_SLUGS = CONCERNS.map((s) => s.slug) as [string, ...string[]];
export const findConcern = (slug: string) => CONCERNS.find((s) => s.slug === slug);
export const concernLabel = (slug: string) => findConcern(slug)?.label ?? slug;

/** よく受ける相談（こまかい心配ごと）。「〜にならない」「〜できる」とは書かない */
export const WORRIES = [
  { slug: "hajimete", label: "犬や猫と暮らすのがはじめて" },
  { slug: "rusu", label: "留守番の時間が長い" },
  { slug: "kodomo", label: "小さな子どもがいる" },
  { slug: "senju", label: "先住の犬や猫がいる" },
  { slug: "shugo", label: "集合住宅で暮らしている" },
  { slug: "iden", label: "遺伝する病気が心配" },
  { slug: "seikaku", label: "性格の合う子を選びたい" },
  { slug: "enpo", label: "遠くに住んでいる" },
  { slug: "hiyou", label: "迎えたあとにかかる費用を知りたい" },
  { slug: "mayoi", label: "家族のなかに迷っている人がいる" },
] as const;
export const WORRY_SLUGS = WORRIES.map((g) => g.slug) as [string, ...string[]];
export const worryLabel = (slug: string) => WORRIES.find((g) => g.slug === slug)?.label ?? slug;

/** 育てている動物 */
export const ANIMALS = ["小型犬", "中型犬", "大型犬", "猫"] as const;

/** 子犬・子猫が育つ場所。優劣ではなく違いの項目 */
export const RAISINGS = ["家の中で家族と", "家の中と犬舎・猫舎を行き来", "専用の犬舎・猫舎で"] as const;
/** 見学のときに会える相手 */
export const MEETS = ["母親と父親に会える", "母親に会える", "子だけに会える"] as const;
/** 見学のときに見られる場所 */
export const TOURS = ["育つ場所の中まで入れる", "育つ場所を外から見られる", "面談の部屋のみ"] as const;
/** 迎えたあとの連絡の取り方 */
export const FOLLOWS = ["いつでも連絡を受ける", "節目ごとにこちらから聞く", "相談があれば受ける"] as const;
export const ROLES = ["代表", "共同で運営", "スタッフ"] as const;

export const VENUE_KINDS = ["専用の犬舎", "専用の猫舎", "自宅の一室", "自宅と犬舎", "その他"] as const;
export const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日", "祝"] as const;
export const FEATURES = [
  "見学は予約制",
  "1日1組まで",
  "駐車場",
  "最寄り駅まで送迎",
  "運動場がある",
  "オンラインで事前相談",
  "動物病院と連携",
  "子ども連れの見学",
] as const;
