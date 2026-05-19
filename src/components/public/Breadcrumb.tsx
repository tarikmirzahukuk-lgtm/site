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
      className="text-xs mb-6 flex items-center gap-2 flex-wrap"
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
            <span style={{ color: "var(--color-muted-dim)" }}>/</span>
          )}
        </span>
      ))}
    </nav>
  );
}
