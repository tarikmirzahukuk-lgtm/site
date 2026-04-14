import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKullaniciDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "yazar";
  bio: string;
  avatar: string;
  createdAt: Date;
}

const KullaniciSchema = new Schema<IKullaniciDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "yazar"], default: "yazar" },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Kullanici: Model<IKullaniciDoc> =
  mongoose.models.Kullanici ||
  mongoose.model<IKullaniciDoc>("Kullanici", KullaniciSchema);

export default Kullanici;
