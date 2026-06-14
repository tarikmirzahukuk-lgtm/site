"use client";

import { useState } from "react";
import Icon from "@/components/public/icons/Icon";
import { SITE_URL } from "@/lib/site-config";

export default function PaylasimButonlari({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/makale/${slug}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className="eyebrow hidden sm:inline"
        style={{ color: "var(--color-muted)" }}
        aria-hidden="true"
      >
        Paylaş
      </span>
      <span
        className="hidden sm:block w-6 h-px"
        style={{ background: "var(--color-gold)" }}
        aria-hidden="true"
      />
      <div className="flex gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter'da paylaş"
          className="icon-btn"
        >
          <Icon name="twitter" size={17} />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn'de paylaş"
          className="icon-btn"
        >
          <Icon name="linkedin" size={17} />
        </a>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Bağlantı kopyalandı" : "Linki kopyala"}
          className="icon-btn"
        >
          <Icon name={copied ? "check" : "link"} size={17} />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Bağlantı kopyalandı" : ""}
      </span>
    </div>
  );
}
