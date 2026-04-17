import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="font-bold text-dark">Tarık Mirza</h3>
            <p className="text-sm text-gray-text mt-2 max-w-xs leading-relaxed">
              Ceza hukuku alanında akademik makaleler, içtihat değerlendirmeleri
              ve güncel hukuki analizler.
            </p>
          </div>
          <div className="flex gap-8">
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
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-border mt-8 pt-8">
          <p className="text-xs text-gray-text">
            © {new Date().getFullYear()} Tarık Mirza. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
