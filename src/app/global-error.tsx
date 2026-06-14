"use client";

import { useEffect } from "react";

export default function GlobalError({
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

  const gold = "#D4AF37";
  const ink = "#F5F5F5";
  const muted = "#B8B8B8";

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F14",
          color: "#D5D2C8",
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          textAlign: "center",
          padding: "96px 24px",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <title>Beklenmedik hata · Tarık Mirza</title>
        <div style={{ maxWidth: 560 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: gold,
              fontWeight: 600,
              margin: "0 0 20px",
            }}
          >
            BEKLENMEDİK HATA
          </p>

          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              color: ink,
              fontSize: "clamp(2rem, 5.5vw, 3rem)",
              margin: 0,
            }}
          >
            Bir aksilik{" "}
            <span style={{ fontStyle: "italic", color: gold, fontWeight: 400 }}>
              oldu.
            </span>
          </h1>

          <div
            style={{
              width: 60,
              height: 1,
              background: "rgba(212,175,55,0.4)",
              margin: "28px auto 0",
            }}
            aria-hidden="true"
          />

          <p
            style={{
              maxWidth: 420,
              margin: "28px auto 0",
              fontSize: 16,
              lineHeight: 1.65,
              color: muted,
            }}
          >
            Bir aksilik oldu, sayfa yüklenemedi. Lütfen tekrar deneyin ya da ana
            sayfaya dönün.
          </p>

          <div
            style={{
              marginTop: 36,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {retry && (
              <button
                type="button"
                onClick={() => retry()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "14px 24px",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  background: gold,
                  color: "#0a0d11",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Tekrar dene
              </button>
            )}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 24px",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: ink,
                background: "transparent",
                border: "1px solid rgba(212,175,55,0.18)",
                textDecoration: "none",
              }}
            >
              Ana sayfa
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
