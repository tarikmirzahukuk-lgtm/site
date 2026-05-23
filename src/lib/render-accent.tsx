import React from "react";

/**
 * Başlık/kicker metninde `*...*` ile sarılı ifadeyi altın-italik vurguya çevirir.
 * Örn: "Ceza Hukukunda *titiz* analiz" → "Ceza Hukukunda " + <span class="italic-gold">titiz</span> + " analiz".
 * `*` içermeyen metin olduğu gibi döner (geriye dönük güvenli).
 */
export function renderAccent(text: string): React.ReactNode {
  if (!text) return null;
  return text.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="italic-gold">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
