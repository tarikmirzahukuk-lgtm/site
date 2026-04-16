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
    <aside className="w-56 bg-dark min-h-screen flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-gray-800">
        <Link href="/" className="block">
          <h1 className="text-white font-bold text-sm">Tarık Mirza</h1>
          <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
              isActive(item.href)
                ? "text-white bg-gray-800 border-l-2 border-primary"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/giris" })}
          className="text-gray-400 text-sm hover:text-white transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
