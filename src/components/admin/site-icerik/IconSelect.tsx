"use client";

import { inputClass } from "./ui";

// İçerik kartlarında kullanılabilen ikon adları (Icon.tsx IconName ile uyumlu).
const ICON_NAMES = [
  "shield",
  "lightning",
  "strategy",
  "pillar",
  "gavel",
  "scale",
  "doc",
  "eye",
  "user",
  "handcuff",
  "phone",
  "whatsapp",
];

export default function IconSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    >
      {/* Listede olmayan eski bir değer varsa kaybetme */}
      {value && !ICON_NAMES.includes(value) && (
        <option value={value}>{value}</option>
      )}
      {ICON_NAMES.map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}
