import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string; // son item href'siz
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs text-gray-text mb-4 flex items-center gap-2 flex-wrap"
    >
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary hover:underline transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-dark font-medium">{item.name}</span>
          )}
          {idx < items.length - 1 && (
            <span className="text-gray-border">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}
