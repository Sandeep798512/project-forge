import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVersionDoc extends Document {
  product: mongoose.Types.ObjectId | string;
  versionNumber: string; // e.g. v1.1.0
  releaseNotes: string;
  fileKey: string;
  isAvailableToExistingCustomers: boolean;
  active: boolean;
  releasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVersionSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    versionNumber: { type: String, required: true, trim: true },
    releaseNotes: { type: String, required: true },
    fileKey: { type: String, required: true },
    isAvailableToExistingCustomers: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    releasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProductVersionSchema.index({ product: 1, versionNumber: 1 }, { unique: true });

export default mongoose.model<IProductVersionDoc>('ProductVersion', ProductVersionSchema);
