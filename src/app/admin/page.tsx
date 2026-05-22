"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";
import { IMakale } from "@/types";

interface Stats {
  totalMakaleler: number;
  yayindaMakaleler: number;
  taslakMakaleler: number;
  totalKategoriler: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [sonMakaleler, setSonMakaleler] = useState<IMakale[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [allRes, publishedRes, draftRes, katRes] = await Promise.all([
          fetch("/api/makaleler?limit=5"),
          fetch("/api/makaleler?status=yayinda&limit=1"),
          fetch("/api/makaleler?status=taslak&limit=1"),
          fetch("/api/kategoriler"),
        ]);

        if (!allRes.ok || !publishedRes.ok || !draftRes.ok || !katRes.ok) {
          setError("Veriler yüklenemedi");
          return;
        }

        const allData = await allRes.json();
        const publishedData = await publishedRes.json();
        const draftData = await draftRes.json();
        const katData = await katRes.json();

        setStats({
          totalMakaleler: allData?.total ?? 0,
          yayindaMakaleler: publishedData?.total ?? 0,
          taslakMakaleler: draftData?.total ?? 0,
          totalKategoriler: Array.isArray(katData) ? katData.length : 0,
        });
        setSonMakaleler(
          Array.isArray(allData?.makaleler) ? allData.makaleler : []
        );
      } catch {
        setError("Ağ hatası");
      }
    }
    fetchData();
  }, []);

  if (error)
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-md px-4 py-2">
        {error}
      </div>
    );

  if (!stats) return <p className="text-[var(--color-muted)] text-sm">Yükleniyor...</p>;

  const userName = session?.user?.name || "Yönetici";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-bold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Genel Bakış
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">Hoş geldiniz, {userName}</p>
        </div>
        <Link href="/admin/makaleler/yeni" className="btn-primary">Yeni Makale</Link>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Makale", value: stats.totalMakaleler },
          { label: "Yayında", value: stats.yayindaMakaleler },
          { label: "Taslak", value: stats.taslakMakaleler },
          { label: "Kategori", value: stats.totalKategoriler },
        ].map((item) => (
          <div key={item.label} className="bg-[var(--color-panel)] rounded-lg border border-[var(--rule-dim)] p-5">
            <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wide">{item.label}</p>
            <p className="text-2xl font-bold mt-1 text-[var(--color-gold)]">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-[var(--color-panel)] rounded-lg border border-[var(--rule-dim)]">
        <div className="px-5 py-4 border-b border-[var(--rule-dim)]">
          <h2 className="font-semibold text-sm text-[var(--color-ink)]">Son Makaleler</h2>
        </div>
        <div className="divide-y divide-[var(--rule-dim)]">
          {sonMakaleler.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[var(--color-muted)]">
              Henüz makale yok.
            </p>
          ) : (
            sonMakaleler.map((makale) => (
              <Link key={makale._id} href={`/admin/makaleler/${makale._id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-[var(--color-panel-hi)] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[var(--color-body)]">{makale.title}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{formatDate(makale.createdAt)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  makale.status === "yayinda"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-[var(--color-panel-hi)] text-[var(--color-muted)]"
                }`}>
                  {makale.status === "yayinda" ? "Yayında" : "Taslak"}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
