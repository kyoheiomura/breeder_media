import { z } from "zod";
import { findCity } from "@/data/areas";
import {
  ANIMALS,
  CONCERN_SLUGS,
  FEATURES,
  FOLLOWS,
  MEETS,
  RAISINGS,
  ROLES,
  TOURS,
  VENUE_KINDS,
  WEEKDAYS,
  WORRY_SLUGS,
} from "@/data/vocab";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "半角英小文字・数字・ハイフンで書く（例: mihon-ken）");
const text = (max: number) =>
  z.string().trim().min(1, "空にしない").max(max, `${max}字以内で書く`);
const kana = z.string().regex(/^[ぁ-んー 　]+$/, "ひらがなで書く");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM で書く");
const yen = z.number().int().nonnegative();

export const PhotoSchema = z.object({
  src: z.string().startsWith("/images/", "public/images/ 以下のパスを書く"),
  alt: z.string().min(10, "写真の内容が分かる alt を10字以上で書く"),
});

export const BreederSchema = z
  .object({
    slug,
    name: text(20),
    nameKana: kana,
    photo: PhotoSchema,
    catchphrase: text(32),
    /** 記事の冒頭に置く導入文。編集部の言葉で、どんな人・どんな場所かを紹介する */
    lead: text(400).optional(),
    /** トップの「ブリーダーさんのことば」に出す、本文から抜き出した一文（かぎかっこは付けない） */
    hook: text(70).optional(),
    concerns: z.array(z.enum(CONCERN_SLUGS)).min(1),
    /** 資格・所属（愛玩動物飼養管理士、犬種クラブの会員 など）。団体名も含めてそのまま書く。ショーの成績はここに書かない */
    qualifications: z.array(text(40)).default([]),
    startedYear: z.number().int().min(1950).max(2100),
    venues: z
      .array(z.object({ slug, role: z.enum(ROLES) }))
      .min(1, "犬舎・猫舎を1つ以上書く"),

    // 比較項目。並び順は lib/compare-fields.ts で決める
    compare: z
      .object({
        feature: text(24), // 育て方の特徴（ひとことで）
        message: text(60), // 迎える人へのメッセージ
        why: text(60),
        belief: text(60),
        parents: text(80), // 親との向き合い方（出産の間隔・休ませ方）
        animals: z.array(z.enum(ANIMALS)).min(1),
        /** 育てている犬種・猫種。正式な名前で書く */
        breeds: z.array(text(24)).min(1).max(4),
        /** 親の頭数と、1年の出産の回数 */
        scale: text(60),
        raising: z.enum(RAISINGS),
        meet: z.enum(MEETS),
        tour: z.enum(TOURS),
        /** はじめての見学にかかる時間の目安（分） */
        visitMin: z.number().int().positive(),
        /** 親と子に受けさせている検査・健康管理。検査の名前で書き、結果の良し悪しや病気にならないことは書かない */
        health: z.array(text(30)).min(1).max(6),
        socialization: text(80), // お迎えまでの過ごさせ方
        matching: text(60), // どの子を迎えるかの決め方
        /** 引き渡し。ageDays は生後何日からか（法律で、生後56日を過ぎるまでは引き渡せない） */
        handover: z.object({
          ageDays: z.number().int().min(50, "生後56日を過ぎるまでは引き渡せない"),
          includes: z.array(text(24)).min(1).max(8),
        }),
        follow: z.enum(FOLLOWS),
        /** 飼い続けられなくなったときに、相談を受けているか */
        takeback: z.boolean(),
        retire: text(80), // 繁殖を終えた親の暮らし
        worries: z.array(z.enum(WORRY_SLUGS)).min(1).max(5),
        notFor: text(80),
        gender: z.enum(["女性", "男性"]).optional(),
        /** 子犬・子猫の通常の価格の幅（税込）。値下げや期間限定の額は書かない */
        price: z
          .object({ min: yen, max: yen, note: text(60).optional() })
          .refine((p) => p.min <= p.max, "min は max 以下にする"),
      })
      .strict(),

    interviewedAt: z.coerce.date(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    verifiedAt: z.coerce.date(),
    interviewer: text(30),
    photographer: text(30).optional(),
    listing: z.enum(["free", "paid"]).default("free"),
    draft: z.boolean().default(false),
  })
  .strict()
  .superRefine((s, ctx) => {
    if (s.publishedAt < s.interviewedAt) {
      ctx.addIssue({ code: "custom", path: ["publishedAt"], message: "取材日より前になっている" });
    }
  });

export const VenueSchema = z
  .object({
    slug,
    name: text(40),
    nameKana: kana,
    kind: z.enum(VENUE_KINDS),
    address: z.object({
      prefSlug: z.string(),
      citySlug: z.string(),
      line: text(60),
      building: text(40).optional(),
    }),
    /** 行き方。駅からの時間や車での目安を文章で */
    access: text(80),
    /** 見学を受けている曜日と時間 */
    hours: z
      .array(z.object({ days: z.array(z.enum(WEEKDAYS)).min(1), open: time, close: time }))
      .min(1),
    hoursNote: text(80).optional(),
    contact: z
      .object({
        phone: z.string().regex(/^[0-9-]+$/, "数字とハイフンで書く").optional(),
        url: z.url().optional(),
        line: z.url().optional(),
      })
      .refine((b) => b.phone || b.url || b.line, "見学の申し込みの窓口を1つ以上書く"),
    /** 第一種動物取扱業（販売）の登録。本人に書いてもらった内容をそのまま書く。載せないブリーダーは掲載しない */
    license: z.object({
      number: text(40),
      registeredAt: z.coerce.date(),
      expiresAt: z.coerce.date(),
      /** 動物取扱責任者 */
      manager: text(20),
    }),
    features: z.array(z.enum(FEATURES)).default([]),
    verifiedAt: z.coerce.date(),
  })
  .strict()
  .superRefine((c, ctx) => {
    if (!findCity(c.address.prefSlug, c.address.citySlug)) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: `data/areas.ts にない地域: ${c.address.prefSlug}/${c.address.citySlug}`,
      });
    }
  });

export type Breeder = z.infer<typeof BreederSchema>;
export type Venue = z.infer<typeof VenueSchema>;
