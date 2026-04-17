import MakaleKart from "./MakaleKart";
import { IMakale } from "@/types";

export default function IlgiliMakaleler({
  makaleler,
}: {
  makaleler: IMakale[];
}) {
  if (makaleler.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-lg font-bold mb-6">İlgili Makaleler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {makaleler.map((makale) => (
          <MakaleKart key={makale._id} makale={makale} />
        ))}
      </div>
    </section>
  );
}
