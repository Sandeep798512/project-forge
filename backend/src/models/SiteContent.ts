import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteContent extends Document {
  key: string; // e.g. 'homepage_hero'
  heroTitle: string;
  heroSubtitle: string;
  promoBannerText?: string;
  promoBannerActive: boolean;
  whatsappNumber: string;
  defaultWhatsAppMessage: string;
  supportEmail: string;
  socialLinks: {
    github?: string;
    instagram?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'homepage_hero' },
    heroTitle: { type: String, default: 'Build Projects That You Can Actually Explain.' },
    heroSubtitle: {
      type: String,
      default:
        'Production-style software projects with source code, documentation, setup guides and support — designed to help students learn, customize and showcase real development work.',
    },
    promoBannerText: { type: String, default: '🎉 Special Instagram Offer: Use code CODE20 for 20% instant discount!' },
    promoBannerActive: { type: Boolean, default: true },
    whatsappNumber: { type: String, default: '918081220303' },
    defaultWhatsAppMessage: { type: String, default: 'Hi! I have a question about project packages on CampusGet.' },
    supportEmail: { type: String, default: 'campusget.in@gmail.com' },
    socialLinks: {
      github: { type: String, default: 'https://github.com/campusget' },
      instagram: { type: String, default: 'https://instagram.com/campusget.in' },
      youtube: { type: String, default: 'https://youtube.com/@campusget' },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
