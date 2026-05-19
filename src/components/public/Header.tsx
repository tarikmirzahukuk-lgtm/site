"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import KategoriDropdown from "@/components/public/KategoriDropdown";
import { IKategori } from "@/types";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header({ kategoriler }: { kategoriler: IKategori[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-gray-border bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-dark">
          Tarık Mirza
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-dark font-medium"
                  : "text-gray-text hover:text-dark"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <KategoriDropdown kategoriler={kategoriler} />
          <Link
            href="/ara"
            className="text-gray-text hover:text-dark transition-colors"
            aria-label="Ara"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-dark"
          aria-label="Menü"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-gray-text hover:text-dark"
            >
              {link.label}
            </Link>
          ))}
          {kategoriler.length > 0 && (
            <div className="pt-2 border-t border-gray-border">
              <p className="text-xs uppercase tracking-wide text-gray-text mb-2">
                Kategoriler
              </p>
              {kategoriler.map((k) => (
                <Link
                  key={k._id}
                  href={`/kategori/${k.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-gray-text hover:text-dark py-1"
                >
                  {k.name}
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/ara"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-gray-text hover:text-dark"
          >
            Ara
          </Link>
        </div>
      )}
    </header>
  );
}
