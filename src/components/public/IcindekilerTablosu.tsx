"use client";

import { useEffect, useState } from "react";
import { toRoman } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function IcindekilerTablosu({ content }: { content: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      tocItems.push({
        id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      });
    });

    setItems(tocItems);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
      <p className="kicker mb-4">İçindekiler</p>
      <ul
        className="space-y-3 pl-5"
        style={{ borderLeft: "1px solid var(--rule-dim)" }}
      >
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`flex gap-3 items-baseline ${item.level === 3 ? "pl-3" : ""}`}
            >
              <span
                className="roman-index text-[0.7rem] flex-shrink-0 leading-snug"
                aria-hidden="true"
                style={{ opacity: isActive ? 1 : 0.5 }}
              >
                {toRoman(idx + 1)}
              </span>
              <a
                href={`#${item.id}`}
                className="text-xs leading-snug transition-colors block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                aria-current={isActive ? "true" : undefined}
                style={{
                  color: isActive ? "var(--color-gold)" : "var(--color-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
