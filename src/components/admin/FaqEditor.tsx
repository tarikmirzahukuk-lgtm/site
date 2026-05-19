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

  return (
    <div className="space-y-3">
      {value.map((faq, idx) => (
        <div
          key={idx}
          className="bg-gray-light/50 border border-gray-border rounded-md p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-text">
              Soru #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-xs text-red-600 hover:underline"
            >
              Sil
            </button>
          </div>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => update(idx, "question", e.target.value)}
            placeholder="Soru"
            className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(idx, "answer", e.target.value)}
            placeholder="Cevap"
            rows={3}
            className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-primary hover:underline"
      >
        + Soru ekle
      </button>
    </div>
  );
}
