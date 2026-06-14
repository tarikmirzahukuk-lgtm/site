"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <div className="arch-motif" aria-hidden="true" />
      <span className="roman-watermark" aria-hidden="true" style={{ top: "12%", right: "8%", fontSize: 64 }}>
        §
      </span>

      <div className="relative z-10 max-w-xl">
        <p className="kicker mb-5">BEKLENMEDİK HATA</p>

        <h1
          className="display-monument"
          style={{ fontSize: "clamp(2rem, 5.5vw, 3.2rem)" }}
        >
          Bir aksilik <span className="italic-gold">oldu.</span>
        </h1>

        <div className="gold-rule mx-auto mt-7" aria-hidden="true" />

        <p
          className="mx-auto mt-7 max-w-md text-base leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Bir aksilik oldu, sayfa yüklenemedi. Sorun büyük olasılıkla geçici;
          birkaç saniye içinde tekrar deneyebilir ya da ana sayfaya
          dönebilirsiniz.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {retry && (
            <button type="button" onClick={() => retry()} className="cta-gold">
              Tekrar dene
            </button>
          )}
          <Link href="/" className="btn-ghost">
            Ana sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
