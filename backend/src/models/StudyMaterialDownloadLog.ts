import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyMaterialDownloadLog extends Document {
  material: mongoose.Types.ObjectId | string;
  user?: mongoose.Types.ObjectId | string;
  deviceId?: string;
  deviceFingerprint?: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: Date;
}

const StudyMaterialDownloadLogSchema: Schema = new Schema(
  {
    material: { type: Schema.Types.ObjectId, ref: 'StudyMaterial', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    deviceId: { type: String, index: true },
    deviceFingerprint: { type: String, index: true },
    ipAddress: { type: String, required: true, index: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

StudyMaterialDownloadLogSchema.index({ material: 1, user: 1 });
StudyMaterialDownloadLogSchema.index({ material: 1, deviceId: 1 });
StudyMaterialDownloadLogSchema.index({ material: 1, deviceFingerprint: 1 });
StudyMaterialDownloadLogSchema.index({ material: 1, ipAddress: 1 });

export default mongoose.model<IStudyMaterialDownloadLog>('StudyMaterialDownloadLog', StudyMaterialDownloadLogSchema);
