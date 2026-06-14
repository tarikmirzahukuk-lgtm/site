import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs mb-6 flex items-center gap-2 flex-wrap tracking-[0.04em]"
      style={{ color: "var(--color-muted)" }}
    >
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-[var(--color-gold)]"
            >
              {item.name}
            </Link>
          ) : (
            <span className="font-medium" style={{ color: "var(--color-ink)" }}>
              {item.name}
            </span>
          )}
          {idx < items.length - 1 && (
            <span aria-hidden="true" style={{ color: "var(--color-gold)", opacity: 0.6 }}>
              ›
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
