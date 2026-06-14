import { IMakale } from "@/types";
import MakaleKart from "@/components/public/MakaleKart";

export default function IlgiliMakaleler({
  makaleler,
}: {
  makaleler: IMakale[];
}) {
  if (makaleler.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t" style={{ borderColor: "var(--rule-dim)" }}>
      <p className="kicker mb-3">İlgili Makaleler</p>
      <h2
        className="text-xl md:text-2xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
      >
        Bunları da okumak ister misiniz?
      </h2>
      <div className="gold-rule-sm mb-7" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {makaleler.map((m) => (
          <MakaleKart key={m._id} makale={m} />
        ))}
      </div>
    </div>
  );
}
