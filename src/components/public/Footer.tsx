import Link from "next/link";
import { IKategori } from "@/types";
import { SITE_CONFIG } from "@/lib/site-config";

export default function Footer({
  kategoriler = [],
}: {
  kategoriler?: IKategori[];
} = {}) {
  return (
    <footer className="border-t border-gray-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-dark">{SITE_CONFIG.brand}</h3>
            <p className="text-sm text-gray-text mt-2 max-w-xs leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-text uppercase tracking-wide mb-3">
              Sayfalar
            </h4>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/hakkimda"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                Hakkımda
              </Link>
              <Link
                href="/iletisim"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                İletişim
              </Link>
              <Link
                href="/rss.xml"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                RSS
              </Link>
            </div>
          </div>
          {kategoriler.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-text uppercase tracking-wide mb-3">
                Kategoriler
              </h4>
              <div className="space-y-2">
                {kategoriler.map((k) => (
                  <Link
                    key={k._id}
                    href={`/kategori/${k.slug}`}
                    className="block text-sm text-gray-text hover:text-dark transition-colors"
                  >
                    {k.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-border mt-8 pt-8">
          <p className="text-xs text-gray-text">
            © {new Date().getFullYear()} {SITE_CONFIG.brand}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
