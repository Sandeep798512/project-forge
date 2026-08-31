import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String },
    icon: { type: String, default: 'Code' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
