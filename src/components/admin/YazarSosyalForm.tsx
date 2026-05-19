"use client";

import { ISocials } from "@/types";

interface Props {
  value: ISocials;
  onChange: (v: ISocials) => void;
}

export default function YazarSosyalForm({ value, onChange }: Props) {
  const update = (key: keyof ISocials, v: string) => {
    onChange({ ...value, [key]: v });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {(["linkedin", "twitter", "orcid", "website"] as const).map((key) => (
        <div key={key}>
          <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
            {key === "orcid"
              ? "ORCID"
              : key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            type="url"
            value={value[key] || ""}
            onChange={(e) => update(key, e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}
    </div>
  );
}
