"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number; // ms
  className?: string;
  /**
   * Stagger desteği: true verilirse, görünür olunca kapsayıcıya
   * `reveal-stagger` sınıfı da eklenir. İç `.stagger-item` öğeleri
   * `--i` (0,1,2…) inline değişkeniyle sıralı gecikmeyle belirir.
   * Mevcut kullanımları bozmaz (varsayılan: false).
   */
  stagger?: boolean;
  /** Kapsayıcı etiketi (varsayılan div) — semantik gerektiğinde. */
  as?: "div" | "section";
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
  stagger = false,
  as = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    // Reduced motion preference — skip animation
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const Tag = as;

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      className={`${className} ${
        visible ? "reveal-visible" : "reveal-hidden"
      } ${stagger ? "reveal-stagger" : ""}`.trim()}
    >
      {children}
    </Tag>
  );
}
