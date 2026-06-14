"use client";

import { useState } from "react";
import Link from "next/link";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { toRoman } from "@/lib/utils";

export default function Faq({ data }: { data: ISiteContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="sss" className="px-5 md:px-16 py-16 md:py-[110px]">
      <div className="max-w-[880px] mx-auto">
        <div className="text-center mb-9 md:mb-12">
          {data.kicker && (
            <div className="kicker mb-3.5 stagger-item" style={{ ["--i" as string]: 0 }}>
              {data.kicker}
            </div>
          )}
          <h2
            className="display-monument m-0 stagger-item"
            style={{ fontSize: "clamp(30px, 4.5vw, 46px)", ["--i" as string]: 0 }}
          >
            {renderAccent(data.heading)}
          </h2>
          <div
            className="gold-rule mx-auto mt-6 rule-draw-center"
            style={{ ["--i" as string]: 1 }}
            aria-hidden="true"
          />
        </div>
        <div
          className="flex flex-col border-t"
          style={{ borderColor: "var(--rule)" }}
        >
          {data.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="border-b stagger-item"
                style={{ borderColor: "var(--rule)", ["--i" as string]: i + 1 }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full min-h-[44px] text-left bg-transparent border-0 cursor-pointer flex justify-between items-center gap-4 py-5 md:py-6 leading-[1.3] transition-colors"
                  style={{
                    color: isOpen ? "var(--color-gold)" : "var(--color-ink)",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(16px, 1.7vw, 19px)",
                    fontWeight: 500,
                  }}
                >
                  <span className="flex items-baseline gap-3.5">
                    <span className="roman-index shrink-0" aria-hidden="true">
                      {toRoman(i + 1)}
                    </span>
                    <span>{f.question}</span>
                  </span>
                  <span
                    className="faq-morph"
                    data-open={isOpen}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-hidden={!isOpen}
                  className={`faq-panel ${isOpen ? "faq-panel-open" : ""}`}
                >
                  <div className="faq-panel-inner">
                    <p
                      className="text-[14.5px] leading-relaxed max-w-[720px] pb-6 md:pb-7 pl-[calc(1.6em+0.875rem)] m-0"
                      style={{ color: "var(--color-body)" }}
                    >
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-9">
          <Link href="/iletisim" className="btn-ghost">
            Başka bir soru sor →
          </Link>
        </div>
      </div>
    </section>
  );
}
