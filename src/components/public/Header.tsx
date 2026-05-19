"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/public/icons/Icon";
import { NAV } from "@/lib/site-data";
import { SITE_CONFIG } from "@/lib/site-config";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ background: "rgba(11,15,20,0.94)", borderColor: "var(--rule-dim)" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between py-4 md:py-5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 plink">
          <span
            className="w-9 h-9 md:w-[38px] md:h-[38px] flex items-center justify-center text-[18px] md:text-[22px] font-medium italic"
            style={{
              border: "1px solid var(--color-gold)",
              color: "var(--color-gold)",
              fontFamily: "var(--font-display)",
            }}
          >
            T
          </span>
          <span className="hidden md:flex flex-col leading-tight">
            <span className="text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
              {SITE_CONFIG.brand}
            </span>
            <span className="text-[10px] mt-0.5 uppercase tracking-[0.22em]" style={{ color: "var(--color-muted)" }}>
              {SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {NAV.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13.5px] tracking-[0.02em] plink"
              style={{
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? "var(--color-gold)" : "var(--color-ink)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/iletisim"
            className="hidden md:inline-flex items-center gap-2.5 px-5 py-3 text-[12.5px] font-bold uppercase tracking-[0.16em] no-underline transition-all"
            style={{ background: "var(--color-gold)", color: "#0a0d11" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e8c452";
              e.currentTarget.style.boxShadow = "0 8px 28px var(--gold-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-gold)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Icon name="phone" size={16} color="#0a0d11" />
            İletişim
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: "var(--color-ink)" }}
            aria-label="Menü"
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t px-5 py-4 space-y-3" style={{ borderColor: "var(--rule-dim)", background: "var(--color-bg)" }}>
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm plink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/iletisim"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em]"
            style={{ background: "var(--color-gold)", color: "#0a0d11" }}
          >
            <Icon name="phone" size={14} color="#0a0d11" />
            İletişim
          </Link>
        </div>
      )}
    </header>
  );
}
