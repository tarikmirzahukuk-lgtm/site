"use client";

import { IFaq } from "@/types";

interface Props {
  value: IFaq[];
  onChange: (v: IFaq[]) => void;
}

export default function FaqEditor({ value, onChange }: Props) {
  const add = () => onChange([...value, { question: "", answer: "" }]);
  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const update = (idx: number, key: keyof IFaq, v: string) => {
    onChange(value.map((f, i) => (i === idx ? { ...f, [key]: v } : f)));
  };

  const inputClass =
    "w-full px-3 py-2 bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] text-[var(--color-ink)] rounded-md text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] placeholder:text-[var(--color-muted-dim)]";

  return (
    <div className="space-y-3">
      {value.map((faq, idx) => (
        <div
          key={idx}
          className="bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] rounded-md p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted)]">
              Soru #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-xs text-red-400 hover:underline"
            >
              Sil
            </button>
          </div>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => update(idx, "question", e.target.value)}
            placeholder="Soru"
            className={inputClass}
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(idx, "answer", e.target.value)}
            placeholder="Cevap"
            rows={3}
            className={inputClass}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-[var(--color-gold)] hover:underline"
      >
        + Soru ekle
      </button>
    </div>
  );
}
