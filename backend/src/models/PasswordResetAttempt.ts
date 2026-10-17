import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetAttempt extends Document {
  email: string;
  ipAddress: string;
  deviceId?: string;
  createdAt: Date;
}

const PasswordResetAttemptSchema: Schema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    ipAddress: { type: String, required: true, index: true },
    deviceId: { type: String, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// TTL Index: Automatically expire & clean up documents after 24 hours (86,400 seconds)
PasswordResetAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Compound indexes for fast query filtering
PasswordResetAttemptSchema.index({ email: 1, createdAt: -1 });
PasswordResetAttemptSchema.index({ ipAddress: 1, createdAt: -1 });
PasswordResetAttemptSchema.index({ deviceId: 1, createdAt: -1 });
PasswordResetAttemptSchema.index({ ipAddress: 1, email: 1 });
PasswordResetAttemptSchema.index({ deviceId: 1, email: 1 });

export default mongoose.model<IPasswordResetAttempt>('PasswordResetAttempt', PasswordResetAttemptSchema);
