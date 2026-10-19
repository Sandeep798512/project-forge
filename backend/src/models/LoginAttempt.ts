import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginAttempt extends Document {
  email: string;
  ipAddress: string;
  createdAt: Date;
}

const LoginAttemptSchema: Schema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    ipAddress: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// TTL Index: Automatically expire & clean up documents after 1 hour (3600 seconds)
LoginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Compound indexes for fast query filtering
LoginAttemptSchema.index({ email: 1, createdAt: -1 });
LoginAttemptSchema.index({ ipAddress: 1, createdAt: -1 });

export default mongoose.model<ILoginAttempt>('LoginAttempt', LoginAttemptSchema);
