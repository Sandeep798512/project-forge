import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string; // Razorpay payment id or generated transaction id
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  order: mongoose.Types.ObjectId | string;
  user: mongoose.Types.ObjectId | string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'paid' | 'failed' | 'refunded';
  rawWebhookPayload?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'pending', 'paid', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    rawWebhookPayload: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
