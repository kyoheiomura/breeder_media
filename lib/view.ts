/**
 * コンテンツから、表示とクライアントに渡すための形を作る。
 * ここで作るオブジェクトはすべてシリアライズ可能（Date は文字列にする）。
 */
import { findCity, findPref } from "@/data/areas";
import { CONCERNS, WEEKDAYS, worryLabel } from "@/data/vocab";
import { venuesOf, type VenueEntry, type BreederEntry } from "@/lib/content";
import type { Venue, Breeder } from "@/lib/schema";

const BUILD_YEAR = new Date().getFullYear();

/** 「はじめて犬や猫を迎える・小型犬」。並びは data/vocab.ts の順 */
export function concernLabels(concerns: Breeder["concerns"]) {
  return CONCERNS.filter((s) => concerns.includes(s.slug)).map((s) => s.label);
}
export function concernsLabel(concerns: Breeder["concerns"]) {
  return concernLabels(concerns).join("・");
}
export function yearsOfWork(s: Breeder) {
  return Math.max(1, BUILD_YEAR - s.startedYear);
}

export function areaOf(c: Venue) {
  const pref = findPref(c.address.prefSlug)!;
  const city = findCity(c.address.prefSlug, c.address.citySlug)!;
  return { pref, city, label: city.name, fullLabel: `${pref.name}${city.name}` };
}

export function formatMonth(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

export function formatDate(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatYen(n: number) {
  return `${n.toLocaleString("ja-JP")}円`;
}

/** 「第一種動物取扱業（販売）〇〇 第123号」の形に */
export function licenseLabel(c: Venue) {
  return `第一種動物取扱業（販売） ${c.license.number}`;
}

/** 「月・火・木 10:00〜20:00」の形に */
export function hoursLabel(c: Venue) {
  return c.hours
    .map((h) => {
      const days = [...h.days].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
      return `${days.join("・")} ${h.open}〜${h.close}`;
    })
    .join("／");
}

const opensWeekend = (c: Venue) => c.hours.some((h) => h.days.includes("土") || h.days.includes("日"));

/** 一覧・カードで使う要約 */
export type BreederSummary = {
  slug: string;
  name: string;
  nameKana: string;
  catchphrase: string;
  /** 本文から抜き出した一文（トップのふきだし） */
  hook?: string;
  /** 章の見出し（カードの「この記事で読めること」） */
  chapters: string[];
  photo: { src: string; alt: string };
  concerns: Breeder["concerns"];
  concernsLabel: string;
  concernLabels: string[];
  areaLabel: string;
  venueName: string;
  prefSlug: string;
  citySlugs: string[];
  areaCode: number;
  worries: string[];
  animals: string[];
  breeds: string[];
  raising: string;
  meet: string;
  tour: string;
  follow: string;
  takeback: boolean;
  gender?: string;
  features: string[];
  weekend: boolean;
  publishedAt: string;
  /** フリーワード検索の対象（名前・一言・比較項目・場所・地域） */
  searchText: string;
};

export function toSummary(s: BreederEntry): BreederSummary {
  const venues = venuesOf(s);
  const main = areaOf(venues[0]);
  return {
    slug: s.slug,
    name: s.name,
    nameKana: s.nameKana,
    catchphrase: s.catchphrase,
    hook: s.hook,
    chapters: [...s.body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim()),
    photo: s.photo,
    concerns: s.concerns,
    concernsLabel: concernsLabel(s.concerns),
    concernLabels: concernLabels(s.concerns),
    areaLabel: main.label,
    venueName: venues[0].name,
    prefSlug: main.pref.slug,
    citySlugs: venues.map((c) => c.address.citySlug),
    areaCode: main.city.code,
    worries: s.compare.worries,
    animals: s.compare.animals,
    breeds: s.compare.breeds,
    raising: s.compare.raising,
    meet: s.compare.meet,
    tour: s.compare.tour,
    follow: s.compare.follow,
    takeback: s.compare.takeback,
    gender: s.compare.gender,
    features: [...new Set(venues.flatMap((c) => c.features))],
    weekend: venues.some(opensWeekend),
    publishedAt: s.publishedAt.toISOString(),
    searchText: [
      s.name,
      s.nameKana,
      s.catchphrase,
      concernsLabel(s.concerns),
      s.compare.feature,
      s.compare.belief,
      s.compare.parents,
      ...s.compare.animals,
      ...s.compare.breeds,
      ...s.compare.health,
      ...s.compare.worries.map(worryLabel),
      ...venues.flatMap((c) => [c.name, areaOf(c).fullLabel, c.access]),
    ].join(" "),
  };
}

/** 比較項目の表示に使う形 */
export type BreederCompareData = BreederSummary & {
  qualifications: string[];
  years: number;
  compare: Omit<Breeder["compare"], "worries"> & { worryLabels: string[] };
  venues: { name: string; kind: string; area: string; access: string; hours: string; hoursNote?: string; license: string }[];
};

export function toCompareData(s: BreederEntry): BreederCompareData {
  const venues = venuesOf(s);
  return {
    ...toSummary(s),
    qualifications: s.qualifications,
    years: yearsOfWork(s),
    compare: { ...s.compare, worryLabels: s.compare.worries.map(worryLabel) },
    venues: venues.map((c: VenueEntry) => ({
      name: c.name,
      kind: c.kind,
      area: areaOf(c).fullLabel,
      access: c.access,
      hours: hoursLabel(c),
      hoursNote: c.hoursNote,
      license: licenseLabel(c),
    })),
  };
}
