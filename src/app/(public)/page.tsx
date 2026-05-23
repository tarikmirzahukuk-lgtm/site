import type { Metadata } from "next";
import Hero from "@/components/public/home/Hero";
import Trusts from "@/components/public/home/Trusts";
import Areas from "@/components/public/home/Areas";
import Process from "@/components/public/home/Process";
import About from "@/components/public/home/About";
import Urgent from "@/components/public/home/Urgent";
import Faq from "@/components/public/home/Faq";
import Reveal from "@/components/public/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/get-site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent();
  return buildMetadata({
    title: `${c.seo.brand} | ${c.seo.tagline}`,
    description: c.seo.description,
    path: "/",
  });
}

export default async function AnaSayfa() {
  const c = await getSiteContent();
  return (
    <>
      <Hero data={c.hero} />
      <Reveal>
        <Trusts data={c.trusts} />
      </Reveal>
      <Reveal delay={50}>
        <Areas data={c.areas} />
      </Reveal>
      <Reveal>
        <Process data={c.process} />
      </Reveal>
      <Reveal delay={50}>
        <About data={c.about} />
      </Reveal>
      <Reveal>
        <Urgent data={c.urgent} contactEmail={c.contact.email} />
      </Reveal>
      <Reveal>
        <Faq data={c.faq} />
      </Reveal>
    </>
  );
}
