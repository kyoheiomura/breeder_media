/** 相談ごとの索引。相談ページ・トップと /concern/ の一覧で使う */
import { CONCERNS } from "@/data/vocab";
import { getAllBreeders } from "@/lib/content";

export function breedersOfConcern(concernSlug: string) {
  return getAllBreeders().filter((s) => s.concerns.includes(concernSlug));
}

/** すべての相談（data/vocab.ts の順）と、取材した人数。まだ0人の相談も含む */
export function getAllConcerns() {
  return CONCERNS.map((concern) => ({ ...concern, count: breedersOfConcern(concern.slug).length }));
}

/** 取材したブリーダーがいる相談だけ（サイトマップなど） */
export function getConcernIndex() {
  return getAllConcerns().filter((s) => s.count > 0);
}
