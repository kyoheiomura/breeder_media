import type { ReactNode } from "react";

/** セクションの見出し：肉球のしるし＋小さな欧文（飾り）＋和文の見出し。まんなかに置く */
export function SectionHead({ id, en, title, lead, voice }: { id: string; en: string; title: ReactNode; lead?: ReactNode; /** ラベルを、しっぽの付いた小さなふきだしの形にする（うすいピーチの面の上で使う） */ voice?: boolean }) {
  return (
    <div className="mx-auto max-w-[36rem] text-center">
      {voice ? (
        <p aria-hidden="true" className="reveal reveal-pop label voice-label">
          {en}
        </p>
      ) : (
        <p aria-hidden="true" className="reveal reveal-pop label">
          {en}
        </p>
      )}
      <h2 id={id} className="reveal section-title mt-4">
        {title}
      </h2>
      {lead && <p className="reveal reveal-soft phrase mt-3 text-[0.9375rem] leading-[1.9] text-sub">{lead}</p>}
    </div>
  );
}
