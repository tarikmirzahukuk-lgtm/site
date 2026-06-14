"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero giriş koreografisi + masaüstü imleç-paralaks denetleyicisi.
 *
 * İki iş yapar:
 *  1) Mount olunca kapsayıcıya `reveal-visible` ekler — böylece Foundation
 *     primitifleri (.draw-on / .col-rise / .rule-draw-center / .line-rise /
 *     .accent-in / .stagger-item) bir kez, sayfa açılışında "çizilerek belirme"
 *     olarak başlar. (Hero ekranın üstündedir; scroll beklenmez.)
 *  2) Yalnız masaüstü (pointer:fine) + hareket-isteyen ortamda, çok hafif bir
 *     imleç-paralaks için `--mx`/`--my` CSS değişkenlerini yazar. SVG derinlik
 *     katmanları bu değerleri minik translate'e çevirir (CSS tarafında).
 *
 * prefers-reduced-motion: reduce → paralaks hiç bağlanmaz; yine de
 * `reveal-visible` eklenir (Foundation primitifleri reduce'da zaten no-op olup
 * nihai görünür duruma düşer). Dokunmatik/coarse pointer'da paralaks bağlanmaz.
 *
 * Yalnızca sunumsal bir sarmalayıcıdır: data/SSR/markup değişmez; çocukları
 * (server-rendered Hero içeriği) olduğu gibi sarar.
 */
export default function HeroMotion({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [entered, setEntered] = useState(false);

  // Giriş: mount sonrası bir frame içinde reveal-visible'a geç.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // İmleç-paralaks: yalnız fine-pointer + no-reduce.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const onMove = (e: PointerEvent) => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        // Merkeze göre -0.5..0.5 normalize.
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        // Çok hafif: tilt sınıfları bunu maks ~6px translate'e ölçekler.
        el.style.setProperty("--mx", nx.toFixed(4));
        el.style.setProperty("--my", ny.toFixed(4));
      });
    };

    const onLeave = () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${entered ? "reveal-visible" : ""} hero-stage`.trim()}
    >
      {children}
    </div>
  );
}
