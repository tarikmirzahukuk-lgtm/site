"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import { FAQ } from "@/lib/site-data";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="sss" className="px-5 md:px-16 py-16 md:py-[110px]">
      <div className="max-w-[880px] mx-auto">
        <div className="text-center mb-9 md:mb-12">
          <div className="kicker mb-3.5">Sık Sorulan Sorular</div>
          <h2 className="display m-0" style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
            Aklınızdaki <span className="italic-gold">ilk sorular.</span>
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`pcard overflow-hidden ${isOpen ? "pcard-open" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full text-left bg-transparent border-0 cursor-pointer flex justify-between items-center gap-4 py-5 px-5 md:py-6 md:px-7 leading-[1.3]"
                  style={{
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(16px, 1.7vw, 19px)",
                    fontWeight: 500,
                  }}
                >
                  <span>{f.question}</span>
                  <Icon
                    name={isOpen ? "minus" : "plus"}
                    size={18}
                    color="var(--color-gold)"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    className="text-[14.5px] leading-[1.75] max-w-[720px] px-5 md:px-7 pb-5 md:pb-7"
                    style={{ color: "var(--color-body)" }}
                  >
                    {f.answer}
                  </div>
                )}
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
