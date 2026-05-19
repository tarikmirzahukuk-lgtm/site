import Link from "next/link";
import { IKategori } from "@/types";

export default function KategoriDropdown({
  kategoriler,
}: {
  kategoriler: IKategori[];
}) {
  if (kategoriler.length === 0) return null;

  return (
    <div className="relative group">
      <button
        type="button"
        className="text-sm text-gray-text hover:text-dark transition-colors flex items-center gap-1"
      >
        Kategoriler
        <svg
          className="w-3 h-3"
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
      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-2">
          {kategoriler.map((k) => (
            <Link
              key={k._id}
              href={`/kategori/${k.slug}`}
              className="block px-4 py-2 text-sm text-gray-text hover:bg-gray-light hover:text-dark"
            >
              {k.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
