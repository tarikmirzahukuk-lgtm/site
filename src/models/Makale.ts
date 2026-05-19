import mongoose, { Schema, Document, Model } from "mongoose";
import type { IFaq } from "@/types";

export interface IMakaleDoc extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  status: "taslak" | "yayinda";
  readingTime: number;
  tags: string[];
  faqs: IFaq[];
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const MakaleSchema = new Schema<IMakaleDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Kategori", required: true },
    author: { type: Schema.Types.ObjectId, ref: "Kullanici", required: true },
    status: { type: String, enum: ["taslak", "yayinda"], default: "taslak" },
    readingTime: { type: Number, default: 1 },
    tags: [{ type: String }],
    faqs: { type: [FaqSchema], default: [] },
  },
  { timestamps: true }
);

MakaleSchema.index({ title: "text", content: "text" });

const Makale: Model<IMakaleDoc> =
  mongoose.models.Makale ||
  mongoose.model<IMakaleDoc>("Makale", MakaleSchema);

export default Makale;
