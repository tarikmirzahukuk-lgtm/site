"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const menuItems = [
  { href: "/admin", label: "Genel Bakış", icon: "📊" },
  { href: "/admin/makaleler", label: "Makaleler", icon: "📝" },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: "📁" },
  { href: "/admin/yazarlar", label: "Yazarlar", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 bg-[var(--color-bg-alt)] min-h-screen flex flex-col flex-shrink-0 border-r border-[var(--rule-dim)]">
      <div className="px-5 py-5 border-b border-[var(--rule-dim)]">
        <Link href="/" className="block">
          <h1 className="text-[var(--color-ink)] font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>Tarık Mirza</h1>
          <p className="text-[var(--color-muted)] text-xs mt-0.5">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
              isActive(item.href)
                ? "text-[var(--color-ink)] bg-[var(--color-panel-hi)] border-l-2 border-[var(--color-gold)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-panel-hi)]"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-[var(--rule-dim)]">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/giris" })}
          className="text-[var(--color-muted)] text-sm hover:text-[var(--color-gold)] transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
