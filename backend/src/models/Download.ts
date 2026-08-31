import mongoose, { Schema, Document } from 'mongoose';

export interface IDownload extends Document {
  user: mongoose.Types.ObjectId | string;
  product: mongoose.Types.ObjectId | string;
  entitlement: mongoose.Types.ObjectId | string;
  versionDownloaded: string;
  ipAddress: string;
  userAgent?: string;
  downloadedAt: Date;
}

const DownloadSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    entitlement: { type: Schema.Types.ObjectId, ref: 'Entitlement', required: true },
    versionDownloaded: { type: String, default: '1.0.0' },
    ipAddress: { type: String, required: true },
    userAgent: { type: String },
    downloadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

DownloadSchema.index({ user: 1, downloadedAt: -1 });

export default mongoose.model<IDownload>('Download', DownloadSchema);
