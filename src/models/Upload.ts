import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUploadDoc extends Document {
  data: Buffer;
  contentType: string;
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema = new Schema<IUploadDoc>(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: true }
);

const Upload: Model<IUploadDoc> =
  mongoose.models.Upload || mongoose.model<IUploadDoc>("Upload", UploadSchema);

export default Upload;
