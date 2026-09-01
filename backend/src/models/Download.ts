import mongoose, { Schema, Document } from 'mongoose';

export interface IDownload extends Document {
  user: mongoose.Types.ObjectId | string;
  product: mongoose.Types.ObjectId | string;
  entitlement: mongoose.Types.ObjectId | string;
  asset?: mongoose.Types.ObjectId | string;
  assetType?: string;
  versionDownloaded: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  failureReason?: string;
  downloadedAt: Date;
}

const DownloadSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    entitlement: { type: Schema.Types.ObjectId, ref: 'Entitlement', required: true },
    asset: { type: Schema.Types.ObjectId, ref: 'ProductAsset' },
    assetType: { type: String, default: 'SOURCE_CODE' },
    versionDownloaded: { type: String, default: '1.0.0' },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: 'Unknown' },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    failureReason: { type: String },
    downloadedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDownload>('Download', DownloadSchema);
