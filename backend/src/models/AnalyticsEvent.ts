import mongoose, { Schema, Document } from 'mongoose';

export type EventType =
  | 'page_view'
  | 'project_view'
  | 'demo_click'
  | 'buy_click'
  | 'checkout_started'
  | 'payment_success'
  | 'payment_failed'
  | 'download_started'
  | 'support_clicked';

export interface IAnalyticsEvent extends Document {
  eventType: EventType;
  user?: mongoose.Types.ObjectId | string;
  product?: mongoose.Types.ObjectId | string;
  metadata?: Schema.Types.Mixed;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AnalyticsEventSchema: Schema = new Schema(
  {
    eventType: {
      type: String,
      enum: [
        'page_view',
        'project_view',
        'demo_click',
        'buy_click',
        'checkout_started',
        'payment_success',
        'payment_failed',
        'download_started',
        'support_clicked',
      ],
      required: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ createdAt: -1 });

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
