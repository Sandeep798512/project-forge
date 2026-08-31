import mongoose, { Schema, Document } from 'mongoose';

export type RbacRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT_MANAGER' | 'CONTENT_MANAGER' | 'USER';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  rbacRole: RbacRole;
  isVerified: boolean;
  isSuspended: boolean;
  verificationToken?: string;
  verificationTokenExpire?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  referralCode: string;
  referredBy?: string;
  totalSpent: number;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    rbacRole: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT_MANAGER', 'CONTENT_MANAGER', 'USER'],
      default: 'USER',
      index: true,
    },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false, index: true },
    verificationToken: { type: String },
    verificationTokenExpire: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },
    totalSpent: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
