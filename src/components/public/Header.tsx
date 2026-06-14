"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/public/icons/Icon";
import ScrollProgress from "@/components/public/ScrollProgress";
import type { INavLink } from "@/types";

export default function Header({
  nav,
  brand,
  tagline,
}: {
  nav: INavLink[];
  brand: string;
  tagline: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Makale okuma sayfasında header altı ilerleme hattı göster (uzun okuma için).
  const isReading = /^\/makale\/[^/]+/.test(pathname);

  // Scroll ile yumuşak yoğunlaşma — sayfa başına yerleştirilen sentinel görünmez
  // olunca .header-scrolled açılır. Salt sınıf değişimi; scroll listener yok.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Yoğunlaşma sentinel'i — sayfanın en üstünde sıfır-yükseklikli işaret. */}
      <div ref={sentinelRef} aria-hidden="true" style={{ position: "absolute", top: 0, height: 1, width: 1, pointerEvents: "none" }} />
      <header
        className={`header-densify sticky top-0 z-30 backdrop-blur-md border-b ${scrolled ? "header-scrolled" : ""}`}
        style={{ background: "rgba(11,15,20,0.94)", borderColor: "var(--rule-dim)" }}
      >
      <div className="masthead-row masthead max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between py-4 md:py-5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 plink">
          <Image
            src="/mirza-logo-header.png"
            alt={brand}
            width={177}
            height={200}
            priority
            unoptimized
            className="monogram-seal h-12 md:h-14 w-auto object-contain shrink-0"
          />
          <span className="flex flex-col leading-tight min-w-0">
            <span
              className="text-sm md:text-base font-semibold truncate max-w-[58vw] md:max-w-none"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {brand}
            </span>
            <span className="hidden md:block text-[10px] mt-0.5 uppercase tracking-[0.22em]" style={{ color: "var(--color-muted)" }}>
              {tagline}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {nav.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-[13.5px] tracking-[0.02em] plink relative pb-1 ${active ? "plink-active" : ""}`}
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--color-gold)" : "var(--color-ink)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/iletisim"
            className="cta-gold hidden md:inline-flex"
          >
            <span className="icon-nudge">
              <Icon name="phone" size={16} color="#0a0d11" />
            </span>
            İletişim
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5"
            style={{ color: "var(--color-ink)" }}
            aria-label="Menü"
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="menu-slide md:hidden border-t px-5 py-4 space-y-3" style={{ borderColor: "var(--rule-dim)", background: "var(--color-bg)" }}>
          {nav.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block text-sm plink ${
                  active
                    ? "border-l-2 border-[var(--color-gold)] pl-3"
                    : ""
                }`}
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--color-gold)" : "var(--color-ink)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
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

      {/* Makale okuma sayfası — header altı altın ilerleme hattı (uzun okuma için) */}
      {isReading && <ScrollProgress />}
    </header>
    </>
  );
}
