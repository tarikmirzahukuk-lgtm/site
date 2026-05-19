"use client";

import { useState } from "react";
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

  const Btn = ({
    href,
    onClick,
    label,
    children,
  }: {
    href?: string;
    onClick?: () => void;
    label: string;
    children: React.ReactNode;
  }) => {
    const className =
      "w-9 h-9 flex items-center justify-center text-xs font-semibold tracking-[0.05em] no-underline transition-all";
    const baseStyle = {
      border: "1px solid var(--rule-dim)",
      color: "var(--color-muted)",
    };
    const enter = (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = "var(--color-gold)";
      e.currentTarget.style.color = "var(--color-gold)";
    };
    const leave = (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = "var(--rule-dim)";
      e.currentTarget.style.color = "var(--color-muted)";
    };
    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={className}
          style={baseStyle}
          onMouseEnter={enter}
          onMouseLeave={leave}
        >
          {children}
        </a>
      );
    }
    return (
      <button
        onClick={onClick}
        aria-label={label}
        className={className}
        style={baseStyle}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex gap-2">
      <Btn href={twitterUrl} label="Twitter'da paylaş">
        X
      </Btn>
      <Btn href={linkedinUrl} label="LinkedIn'de paylaş">
        in
      </Btn>
      <Btn onClick={handleCopy} label="Linki kopyala">
        {copied ? "✓" : "⎘"}
      </Btn>
    </div>
  );
}
