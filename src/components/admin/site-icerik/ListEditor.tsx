"use client";

import IconSelect from "./IconSelect";
import { inputClass, labelClass } from "./ui";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "icon";
};

export default function ListEditor<T extends object>({
  items,
  onChange,
  fields,
  newItem,
  addLabel,
  itemTitle,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  fields: FieldDef[];
  newItem: T;
  addLabel: string;
  itemTitle?: (item: T, index: number) => string;
}) {
  const val = (item: T, key: string) =>
    (item as Record<string, string>)[key] ?? "";

  const update = (i: number, key: string, value: string) =>
    onChange(
      items.map((it, idx) => (idx === i ? ({ ...it, [key]: value } as T) : it))
    );

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const add = () => onChange([...items, { ...newItem }]);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] rounded-md p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted)]">
              {itemTitle ? itemTitle(item, i) : `#${i + 1}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)] disabled:opacity-30"
                aria-label="Yukarı taşı"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)] disabled:opacity-30"
                aria-label="Aşağı taşı"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-400 hover:underline"
              >
                Sil
              </button>
            </div>
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <label className={labelClass}>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  value={val(item, f.key)}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  rows={2}
                  className={inputClass}
                />
              ) : f.type === "icon" ? (
                <IconSelect
                  value={val(item, f.key)}
                  onChange={(v) => update(i, f.key, v)}
                />
              ) : (
                <input
                  type="text"
                  value={val(item, f.key)}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-[var(--color-gold)] hover:underline"
      >
        + {addLabel}
      </button>
    </div>
  );
}
