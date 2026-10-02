import mongoose, { Schema, Document } from 'mongoose';

export type MaterialType = 'NOTES' | 'PYQ' | 'PPT' | 'SYLLABUS' | 'LAB_MANUAL' | 'OTHER';

export interface IStudyMaterial extends Document {
  title: string;
  description?: string;
  university: string;
  branch: string;
  semester: string;
  subject: string;
  materialType: MaterialType;
  fileName: string;
  storageKey: string;
  fileSize: number;
  mimeType?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    university: { type: String, required: true, trim: true, default: 'AKTU', index: true },
    branch: { type: String, required: true, trim: true, index: true },
    semester: { type: String, required: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true, index: true },
    materialType: {
      type: String,
      enum: ['NOTES', 'PYQ', 'PPT', 'SYLLABUS', 'LAB_MANUAL', 'OTHER'],
      default: 'NOTES',
      index: true,
    },
    fileName: { type: String, required: true },
    storageKey: { type: String, required: true },
    fileSize: { type: Number, required: true, default: 0 },
    mimeType: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound and text indexes for fast filtering & search
StudyMaterialSchema.index({ university: 1, branch: 1, semester: 1, materialType: 1, isPublished: 1 });
StudyMaterialSchema.index({ title: 'text', subject: 'text', description: 'text' });

export default mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
