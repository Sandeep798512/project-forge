import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId | string;
  product: mongoose.Types.ObjectId | string;
  rating: number; // 1-5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    isVerifiedPurchase: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, isApproved: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
