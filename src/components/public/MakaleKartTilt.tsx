"use client";

import { useEffect, useRef } from "react";

/**
 * MakaleKart için salt-sunumsal pointer eğimi sarmalayıcısı (Aşama 4).
 *
 * Kart üzerine fareyle gelindiğinde imleç konumuna göre çok hafif bir 3B eğim
 * (maks ~5deg) uygular — "derinlik" hissi, parıltı değil. CSS tarafında `.card-tilt`
 * `--rx`/`--ry` değişkenlerini perspective rotateX/rotateY'ye çevirir; bu bileşen
 * yalnız o değişkenleri rAF-throttled yazar.
 *
 * Kapanma koşulları (hiç bağlanmaz, transform CSS'te none'a düşer):
 *   - prefers-reduced-motion: reduce
 *   - coarse pointer / (pointer: fine) değilse (dokunmatik)
 *
 * Veri/markup değişmez; çocuğunu (server-rendered <Link>/MakaleKart) olduğu gibi sarar.
 */
export default function MakaleKartTilt({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    el.classList.add("card-tilt");

    const MAX = 5; // derece

    const onMove = (e: PointerEvent) => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        // Merkeze göre -0.5..0.5 normalize.
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        // Üst kenara gelince geriye yaslanır: rotateX ekseni ters işaret.
        el.style.setProperty("--ry", `${(nx * MAX * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-ny * MAX * 2).toFixed(2)}deg`);
      });
    };

    const reset = () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointercancel", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("pointercancel", reset);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      el.classList.remove("card-tilt");
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
