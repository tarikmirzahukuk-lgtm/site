"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Hedef değer — sayısal metin (örn. "12", "1.500", "20+"). */
  value: string;
  /** Tween süresi (ms). */
  duration?: number;
  className?: string;
}

/**
 * Görünür olunca 0 → hedef rAF tween ile sayar. Değer sayısal değilse
 * (veya rakam içermiyorsa) düz gösterir. prefers-reduced-motion: reduce →
 * anında hedef değer. Sayının başındaki/sonundaki ek metin (örn. "+", "yıl")
 * korunur. Yalnız metin içeriğini günceller — layout/format değişmez.
 *
 * HENÜZ mount edilmedi — sonraki aşamada istatistik alanlarında kullanılacak.
 */
export default function CountUp({ value, duration = 1200, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(value);

  // value içindeki ilk sayısal bloğu ve çevresini parçala.
  const match = value.match(/^(\D*)([\d.,]+)(\D*)$/);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Sayısal değilse: düz göster, animasyon yok.
    if (!match) {
      setDisplay(value);
      return;
    }

    const [, prefix, numRaw, suffix] = match;
    // Türkçe binlik ayıracı (.) ve ondalık (,) toleransı — yalnız tam sayı tween'i.
    const digits = numRaw.replace(/[.,]/g, "");
    const target = parseInt(digits, 10);
    if (!Number.isFinite(target)) {
      setDisplay(value);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) {
      setDisplay(value);
      return;
    }

    let started = false;

    const tween = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(eased * target);
        setDisplay(`${prefix}${current.toLocaleString("tr-TR")}${suffix}`);
        if (t < 1) {
          rafRef.current = window.requestAnimationFrame(step);
        } else {
          setDisplay(value); // nihai: orijinal biçim
        }
      };
      rafRef.current = window.requestAnimationFrame(step);
    };

    // Başlangıç durumu: 0
    setDisplay(`${prefix}0${suffix}`);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            tween();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, match]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
