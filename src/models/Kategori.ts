import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKategoriDoc extends Document {
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const KategoriSchema = new Schema<IKategoriDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Kategori: Model<IKategoriDoc> =
  mongoose.models.Kategori ||
  mongoose.model<IKategoriDoc>("Kategori", KategoriSchema);

export default Kategori;
