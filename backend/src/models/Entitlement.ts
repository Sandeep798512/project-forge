import mongoose, { Schema, Document } from 'mongoose';

export interface IEntitlement extends Document {
  user: mongoose.Types.ObjectId | string;
  product: mongoose.Types.ObjectId | string;
  order: mongoose.Types.ObjectId | string;
  purchasedVersion: string;
  grantedAt: Date;
  downloadCount: number;
  maxDownloads: number;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EntitlementSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    purchasedVersion: { type: String, default: '1.0.0' },
    grantedAt: { type: Date, default: Date.now },
    downloadCount: { type: Number, default: 0 },
    maxDownloads: { type: Number, default: 20 },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index to quickly query if user owns product
EntitlementSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model<IEntitlement>('Entitlement', EntitlementSchema);
