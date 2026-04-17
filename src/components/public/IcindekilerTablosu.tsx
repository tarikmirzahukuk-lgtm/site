"use client";

import { useEffect, useState } from "react";

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
    <nav className="hidden lg:block w-48 flex-shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-semibold text-gray-text uppercase tracking-widest mb-3">
          İçindekiler
        </p>
        <div className="border-l-2 border-gray-border pl-3 space-y-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-xs transition-colors ${
                item.level === 3 ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-gray-text hover:text-dark"
              }`}
            >
              {item.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
