"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Header altı ince (2px) altın ilerleme hattı — scaleX ile sayfa scroll
 * ilerlemesini gösterir. rAF-throttled scroll/resize dinleyicisi; yalnız
 * transform kullanır (layout thrash yok). prefers-reduced-motion: reduce →
 * tamamen gizli (hiç render edilmez).
 *
 * HENÜZ mount edilmedi — sonraki aşamada layout/header'a eklenecek.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const update = () => {
      rafRef.current = null;
      const el = barRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          background: "var(--color-gold)",
          transform: "scaleX(0)",
          transformOrigin: "left center",
          willChange: "transform",
        }}
      />
    </div>
  );
}
