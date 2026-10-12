import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliverableItem {
  name: string;
  included: boolean;
  fileKey?: string;
}

export interface IProductVersion {
  versionNumber: string;
  releaseNotes: string;
  fileKey: string;
  releasedAt: Date;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: mongoose.Types.ObjectId | string;
  techStack: string[];
  tags: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  thumbnail: string;
  screenshots: string[];
  demoVideoUrl?: string;
  liveDemoUrl?: string;
  githubPreviewUrl?: string;
  features: string[];
  architectureDetails?: string;
  databaseDetails?: string;
  requirements: string[];
  deliverables: IDeliverableItem[];
  assets?: (mongoose.Types.ObjectId | string)[];
  hasCode?: boolean;
  hasPPT?: boolean;
  hasReport?: boolean;
  hasSupport?: boolean;
  hasDoc?: boolean;
  hasDocumentation?: boolean;
  hasVivaQA?: boolean;
  hasSetupSupport?: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  freePreview: boolean;
  isPublished: boolean;
  currentVersion: string;
  versions: IProductVersion[];
  downloadCount: number;
  ratingAverage: number;
  ratingCount: number;
  maxDownloadsAllowed: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    techStack: [{ type: String }],
    tags: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    thumbnail: { type: String, required: true },
    screenshots: [{ type: String }],
    demoVideoUrl: { type: String },
    liveDemoUrl: { type: String },
    githubPreviewUrl: { type: String },
    features: [{ type: String }],
    architectureDetails: { type: String },
    databaseDetails: { type: String },
    requirements: [{ type: String }],
    deliverables: [
      {
        name: { type: String, required: true },
        included: { type: Boolean, default: true },
        fileKey: { type: String },
      },
    ],
    assets: [{ type: Schema.Types.ObjectId, ref: 'ProductAsset' }],
    hasCode: { type: Boolean, default: true },
    hasPPT: { type: Boolean, default: true },
    hasReport: { type: Boolean, default: true },
    hasSupport: { type: Boolean, default: true },
    hasDoc: { type: Boolean, default: true },
    hasDocumentation: { type: Boolean, default: true },
    hasVivaQA: { type: Boolean, default: true },
    hasSetupSupport: { type: Boolean, default: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    freePreview: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true, index: true },
    currentVersion: { type: String, default: '1.0.0' },
    versions: [
      {
        versionNumber: { type: String, required: true },
        releaseNotes: { type: String },
        fileKey: { type: String, required: true },
        releasedAt: { type: Date, default: Date.now },
      },
    ],
    downloadCount: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    maxDownloadsAllowed: { type: Number, default: 20 },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', techStack: 'text', tags: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
