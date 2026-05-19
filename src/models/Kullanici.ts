import mongoose, { Schema, Document, Model } from "mongoose";
import { slugify } from "@/lib/utils";

export interface ISocials {
  linkedin?: string;
  twitter?: string;
  orcid?: string;
  website?: string;
}

export interface IKullaniciDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "yazar";
  bio: string;
  avatar: string;
  slug: string;
  socials: ISocials;
  createdAt: Date;
  updatedAt: Date;
}

const SocialsSchema = new Schema<ISocials>(
  {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    orcid: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { _id: false }
);

const KullaniciSchema = new Schema<IKullaniciDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "yazar"], default: "yazar" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    slug: { type: String, unique: true, sparse: true, index: true },
    socials: { type: SocialsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Pre-save hook: slug yoksa name'den üret, çakışmada -2, -3... suffix ekle
KullaniciSchema.pre("save", async function () {
  if (!this.slug && this.name) {
    const base = slugify(this.name);
    let candidate = base;
    let i = 2;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    while (
      await (self.constructor as Model<IKullaniciDoc>).findOne({
        slug: candidate,
        _id: { $ne: self._id },
      })
    ) {
      candidate = `${base}-${i++}`;
    }
    this.slug = candidate;
  }
});

const Kullanici: Model<IKullaniciDoc> =
  mongoose.models.Kullanici ||
  mongoose.model<IKullaniciDoc>("Kullanici", KullaniciSchema);

export default Kullanici;
