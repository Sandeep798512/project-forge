import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomizationOffer extends Document {
  title: string;
  price: string; // e.g. "₹499+"
  description: string;
  features: string[];
  recommended: boolean;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomizationOfferSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    recommended: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomizationOffer>('CustomizationOffer', CustomizationOfferSchema);
