import mongoose, { Schema, Document, Model } from "mongoose";
import type { ISiteContent } from "@/types";

export interface ISiteContentDoc extends Document, Omit<ISiteContent, "key"> {
  key: string;
}

const Cta = {
  label: { type: String, default: "" },
  href: { type: String, default: "" },
};

const IconItem = new Schema(
  { icon: String, title: String, description: String },
  { _id: false }
);
const Step = new Schema(
  { number: String, title: String, description: String },
  { _id: false }
);
const Stat = new Schema({ value: String, label: String }, { _id: false });
const Badge = new Schema({ icon: String, label: String }, { _id: false });
const Nav = new Schema({ label: String, href: String }, { _id: false });
const Faq = new Schema({ question: String, answer: String }, { _id: false });

const SiteContentSchema = new Schema<ISiteContentDoc>(
  {
    key: { type: String, default: "main", unique: true },
    hero: {
      kicker: String,
      heading: String,
      subtext: String,
      primaryCta: Cta,
      secondaryCta: Cta,
      badges: { type: [Badge], default: [] },
    },
    trusts: {
      kicker: String,
      heading: String,
      intro: String,
      items: { type: [IconItem], default: [] },
    },
    areas: {
      kicker: String,
      heading: String,
      intro: String,
      items: { type: [IconItem], default: [] },
    },
    process: {
      kicker: String,
      heading: String,
      intro: String,
      items: { type: [Step], default: [] },
    },
    about: {
      kicker: String,
      heading: String,
      body: String,
      portraitImage: String,
      stats: { type: [Stat], default: [] },
    },
    urgent: {
      kicker: String,
      heading: String,
      body: String,
      emailKanal: { label: String, value: String },
      secondaryCta: Cta,
    },
    faq: {
      kicker: String,
      heading: String,
      items: { type: [Faq], default: [] },
    },
    hakkimda: {
      title: String,
      body: String,
      avatarImage: String,
      metaDescription: String,
    },
    contact: {
      phone: String,
      phoneRaw: String,
      whatsapp: String,
      email: String,
      address: { line1: String, line2: String, postalCode: String },
    },
    professional: {
      barosicil: String,
      since: Number,
      experienceLabel: String,
    },
    author: {
      name: String,
      jobTitle: String,
      knowsAbout: { type: [String], default: [] },
      bio: String,
    },
    nav: { type: [Nav], default: [] },
    seo: {
      brand: String,
      brandShort: String,
      tagline: String,
      description: String,
    },
    socials: {
      linkedin: String,
      twitter: String,
      orcid: String,
      website: String,
    },
  },
  { timestamps: true, minimize: false }
);

const SiteContent: Model<ISiteContentDoc> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContentDoc>("SiteContent", SiteContentSchema);

export default SiteContent;
