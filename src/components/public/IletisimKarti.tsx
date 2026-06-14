"use client";

import { useState } from "react";
import Icon, { type IconName } from "@/components/public/icons/Icon";

interface Props {
  label: string;
  value: string;
  href: string;
  icon: IconName;
  external?: boolean;
  copyValue?: string;
}

export default function IletisimKarti({
  label,
  value,
  href,
  icon,
  external,
  copyValue,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="iletisim-karti group tablet-card relative p-6 md:p-7">
      <div className="flex items-start gap-3">
        <span className="iletisim-karti-icon mt-0.5 shrink-0" aria-hidden="true">
          <Icon name={icon} size={18} color="var(--color-gold)" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="kicker mb-2">{label}</h3>
          {/* Stretched link — tüm kartı tıklanabilir kılar */}
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="iletisim-karti-link break-all transition-colors group-hover:text-[var(--color-gold)]"
            style={{ color: "var(--color-gold)" }}
          >
            {value}
          </a>
        </div>
        {copyValue !== undefined && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Kopyalandı" : "E-postayı kopyala"}
            className="icon-btn relative z-10 shrink-0"
          >
            <Icon name={copied ? "check" : "link"} size={16} />
          </button>
        )}
      </div>
      {copyValue !== undefined && (
        <span className="sr-only" aria-live="polite">
          {copied ? "E-posta kopyalandı" : ""}
        </span>
      )}
    </div>
  );
}
