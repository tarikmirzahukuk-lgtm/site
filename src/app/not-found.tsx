import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <div className="arch-motif" aria-hidden="true" />
      <span className="roman-watermark" aria-hidden="true" style={{ top: "12%", right: "8%", fontSize: 64 }}>
        §
      </span>

      <div className="relative z-10 max-w-2xl">
        <p className="kicker mb-5">HATA · IV04 · KAYIP DOSYA</p>

        <h1
          className="display-monument"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.6rem)" }}
        >
          Bu dava dosyası <span className="italic-gold">bulunamadı.</span>
        </h1>

        <div className="gold-rule mx-auto mt-7" aria-hidden="true" />

        <p
          className="mx-auto mt-7 max-w-md text-base leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Aradığınız sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
          Arşive geri dönebilir veya doğrudan yeni bir araştırmaya
          başlayabilirsiniz.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="cta-gold">
            Ana sayfaya dön
          </Link>
          <Link href="/makaleler" className="btn-ghost">
            Makaleleri keşfet
          </Link>
        </div>

        <div className="gold-rule-sm mx-auto mt-14 mb-6" aria-hidden="true" />

        <section aria-labelledby="ara-baslik">
          <h2
            id="ara-baslik"
            className="text-lg"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            Aradığınızı arayın
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--color-muted-dim)" }}>
            Bir kavram ya da başlık aklınızdaysa arşivde tarayın.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link href="/ara" className="btn-ghost">
              Arşivde ara
            </Link>
            <Link href="/iletisim" className="plink text-sm" style={{ color: "var(--color-muted)" }}>
              İletişime geç
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
