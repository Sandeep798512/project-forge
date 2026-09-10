import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId | string;
  title: string;
  price: number;
}

export interface IOrder extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId | string;
  items: IOrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string;
  acceptedTermsAt?: Date;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    couponCode: { type: String },
    acceptedTermsAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
