import mongoose, { Schema, Document } from 'mongoose';

export type AssetType =
  | 'SOURCE_CODE'
  | 'DOCUMENTATION'
  | 'PPT'
  | 'PROJECT_REPORT'
  | 'SETUP_GUIDE'
  | 'DEPLOYMENT_GUIDE'
  | 'VIVA'
  | 'ARCHITECTURE'
  | 'OTHER';

export interface IProductAssetDoc extends Document {
  product: mongoose.Types.ObjectId | string;
  version?: mongoose.Types.ObjectId | string;
  assetType: AssetType;
  title: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  isActive: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductAssetSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    version: { type: Schema.Types.ObjectId, ref: 'ProductVersion' },
    assetType: {
      type: String,
      enum: [
        'SOURCE_CODE',
        'DOCUMENTATION',
        'PPT',
        'PROJECT_REPORT',
        'SETUP_GUIDE',
        'DEPLOYMENT_GUIDE',
        'VIVA',
        'ARCHITECTURE',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    storageKey: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductAssetSchema.index({ product: 1, assetType: 1 });

export default mongoose.model<IProductAssetDoc>('ProductAsset', ProductAssetSchema);
