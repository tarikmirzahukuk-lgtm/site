import React from "react";

/**
 * Başlık/kicker metninde `*...*` ile sarılı ifadeyi altın-italik vurguya çevirir.
 * Örn: "Ceza Hukukunda *titiz* analiz" → "Ceza Hukukunda " + <span class="italic-gold">titiz</span> + " analiz".
 * `*` içermeyen metin olduğu gibi döner (geriye dönük güvenli).
 *
 * `accentClassName` verilirse vurgu span'ine ek sınıf(lar) eklenir (örn. Hero'da
 * `.accent-in` giriş hareketi). Varsayılan boş → mevcut çıktı bozulmaz.
 */
export function renderAccent(
  text: string,
  accentClassName = ""
): React.ReactNode {
  if (!text) return null;
  return text.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={`italic-gold ${accentClassName}`.trim()}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
