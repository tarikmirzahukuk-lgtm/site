import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";
import type { ISiteContent } from "@/types";

export const SITE_CONTENT_TAG = "site-content";

// Varsayılanın üzerine DB dökümanını DERİN birleştirir: eksik alt-alanlar (örn.
// hero.badges, areas.items) varsayılandan doldurulur → tüketici asla undefined
// bir bölüm/dizi görmez (shallow spread bunu garanti etmiyordu).
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (base && typeof base === "object") {
    if (typeof override !== "object" || Array.isArray(override)) return base;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    const ov = override as Record<string, unknown>;
    for (const k of Object.keys(ov)) {
      out[k] = deepMerge((base as Record<string, unknown>)[k], ov[k]);
    }
    return out as T;
  }
  return override as T;
}

/** DB dökümanını (veya null) varsayılanlarla güvenli biçimde birleştirir. */
export function mergeWithDefaults(doc: unknown): ISiteContent {
  if (!doc) return SITE_CONTENT_DEFAULTS;
  return deepMerge(SITE_CONTENT_DEFAULTS, JSON.parse(JSON.stringify(doc)));
}

async function readSiteContent(): Promise<ISiteContent> {
  try {
    await dbConnect();
    const doc = await SiteContent.findOne({ key: "main" }).lean();
    return mergeWithDefaults(doc);
  } catch (e) {
    // DB erişilemezse site boş render etmesin — varsayılana düş, ama sessiz kalma.
    console.error("getSiteContent okunamadı, varsayılana düşülüyor:", e);
    return SITE_CONTENT_DEFAULTS;
  }
}

/**
 * Public sayfaların okuduğu önbellekli erişimci.
 * `site-content` tag'i ile işaretli; admin kaydında revalidateTag ile tazelenir.
 */
export const getSiteContent = unstable_cache(readSiteContent, ["site-content"], {
  tags: [SITE_CONTENT_TAG],
  revalidate: 3600,
});
