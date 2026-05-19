import Link from "next/link";
import { IKategori } from "@/types";

export default function KategoriDropdown({
  kategoriler,
}: {
  kategoriler: IKategori[];
}) {
  if (kategoriler.length === 0) return null;

  return (
    <div className="relative group focus-within:[&>div]:opacity-100 focus-within:[&>div]:visible">
      <button
        type="button"
        className="text-[13.5px] transition-colors flex items-center gap-1 plink"
        aria-haspopup="true"
      >
        Kategoriler
        <svg
          className="w-3 h-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
        style={{ background: "var(--color-panel)", border: "1px solid var(--rule)" }}
      >
        <div className="py-2">
          {kategoriler.map((k) => (
            <Link
              key={k._id}
              href={`/kategori/${k.slug}`}
              className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--color-panel-hi)] hover:text-[var(--color-gold)]"
              style={{ color: "var(--color-muted)" }}
            >
              {k.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
