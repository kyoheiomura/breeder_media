"use client";

/**
 * .reveal の要素が画面に入ったら .is-in を付ける（スクロールして、はじめて現れる）。
 * - 同じタイミングで入った要素は、上から・左から順に少しずつ遅らせる
 * - あとから描かれた要素（一覧の絞り込みなど）も拾う
 * - ページのいちばん下まで来たら、残りはすべて出す（下の端にあって判定の線を越えられない要素のため）
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const pending = () => [...document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)")];
    if (!("IntersectionObserver" in window)) {
      pending().forEach((el) => el.classList.add("is-in"));
      return;
    }
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.round(a.boundingClientRect.top / 40) - Math.round(b.boundingClientRect.top / 40) || a.boundingClientRect.left - b.boundingClientRect.left);
        shown.forEach((e, i) => {
          const el = e.target as HTMLElement;
          el.style.setProperty("--stagger", `${Math.min(i, 8) * 110}ms`);
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const watch = () =>
      pending().forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    watch();

    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    const onScroll = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 8) return;
      pending()
        .filter((el) => el.getBoundingClientRect().top < window.innerHeight)
        .forEach((el, i) => {
          el.style.setProperty("--stagger", `${Math.min(i, 8) * 110}ms`);
          el.classList.add("is-in");
          io.unobserve(el);
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);
  return null;
}
