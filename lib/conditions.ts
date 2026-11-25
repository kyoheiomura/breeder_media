/** 「特徴・こだわり」の絞り込み条件。一覧で使う。優劣ではなく、違いで絞り込む */
import type { BreederSummary } from "@/lib/view";

export const CONDITIONS = [
  { key: "parents", label: "母親と父親に会える", test: (s: BreederSummary) => s.meet === "母親と父親に会える" },
  { key: "inside", label: "育つ場所の中まで入れる", test: (s: BreederSummary) => s.tour === "育つ場所の中まで入れる" },
  { key: "home", label: "家の中で育つ", test: (s: BreederSummary) => s.raising === "家の中で家族と" },
  { key: "anytime", label: "迎えたあと、いつでも連絡できる", test: (s: BreederSummary) => s.follow === "いつでも連絡を受ける" },
  { key: "takeback", label: "飼えなくなったときの相談を受ける", test: (s: BreederSummary) => s.takeback },
  { key: "female", label: "女性のブリーダー", test: (s: BreederSummary) => s.gender === "女性" },
  { key: "weekend", label: "土日に見学できる", test: (s: BreederSummary) => s.weekend },
  { key: "parking", label: "駐車場がある", test: (s: BreederSummary) => s.features.includes("駐車場") },
  { key: "pickup", label: "最寄り駅まで送迎がある", test: (s: BreederSummary) => s.features.includes("最寄り駅まで送迎") },
  { key: "online", label: "オンラインで事前に相談できる", test: (s: BreederSummary) => s.features.includes("オンラインで事前相談") },
  { key: "kids", label: "子ども連れで見学できる", test: (s: BreederSummary) => s.features.includes("子ども連れの見学") },
] as const;
