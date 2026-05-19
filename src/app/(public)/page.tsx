import type { Metadata } from "next";
import Hero from "@/components/public/home/Hero";
import Trusts from "@/components/public/home/Trusts";
import Areas from "@/components/public/home/Areas";
import Process from "@/components/public/home/Process";
import About from "@/components/public/home/About";
import Urgent from "@/components/public/home/Urgent";
import Faq from "@/components/public/home/Faq";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: `${SITE_CONFIG.brand} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
});

export default function AnaSayfa() {
  return (
    <>
      <Hero />
      <Trusts />
      <Areas />
      <Process />
      <About />
      <Urgent />
      <Faq />
    </>
  );
}
