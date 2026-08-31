import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketMessage {
  sender: 'user' | 'admin';
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  ticketId: string;
  user: mongoose.Types.ObjectId | string;
  order?: mongoose.Types.ObjectId | string;
  product?: mongoose.Types.ObjectId | string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  messages: ITicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    messages: [
      {
        sender: { type: String, enum: ['user', 'admin'], required: true },
        senderName: { type: String, required: true },
        message: { type: String, required: true },
        attachments: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

SupportTicketSchema.index({ user: 1, status: 1 });

export default mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
