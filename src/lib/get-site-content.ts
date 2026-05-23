import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";
import type { ISiteContent } from "@/types";

export const SITE_CONTENT_TAG = "site-content";

async function readSiteContent(): Promise<ISiteContent> {
  try {
    await dbConnect();
    const doc = await SiteContent.findOne({ key: "main" }).lean();
    if (!doc) return SITE_CONTENT_DEFAULTS;
    // _id/ObjectId/Date'leri düz JSON'a çevir (client component'lere de güvenli geçer)
    return {
      ...SITE_CONTENT_DEFAULTS,
      ...JSON.parse(JSON.stringify(doc)),
    } as ISiteContent;
  } catch {
    // DB erişilemezse site boş render etmesin — varsayılanlara düş.
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
