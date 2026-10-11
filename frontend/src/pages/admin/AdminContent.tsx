import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export const AdminContent: React.FC = () => {
  const [content, setContent] = useState<any>({
    heroTitle: '',
    heroSubtitle: '',
    promoBannerText: '',
    promoBannerActive: true,
    whatsappNumber: '918081220303',
    supportEmail: 'campusget.in@gmail.com',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/content');
      if (res.data.success && res.data.content) {
        setContent(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/admin/content', content);
      if (res.data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert('Error updating site content');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Content Management System (CMS)</h1>
          <p className="text-gray-400 text-xs mt-1">Dynamically edit homepage hero copy, promotional banners, and support details in MongoDB.</p>
        </div>

        {saved && (
          <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>Content Saved to MongoDB!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSaveContent} className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-gray-300 mb-1">Homepage Hero Title</label>
          <input
            type="text"
            required
            value={content.heroTitle}
            onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Homepage Subtitle</label>
          <textarea
            rows={3}
            required
            value={content.heroSubtitle}
            onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-300 mb-1">Promotional Banner Announcement</label>
          <input
            type="text"
            value={content.promoBannerText || ''}
            onChange={(e) => setContent({ ...content, promoBannerText: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">WhatsApp Support Number</label>
            <input
              type="text"
              required
              value={content.whatsappNumber}
              onChange={(e) => setContent({ ...content, whatsappNumber: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Support Email Address</label>
            <input
              type="email"
              required
              value={content.supportEmail}
              onChange={(e) => setContent({ ...content, supportEmail: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold flex items-center space-x-1.5 shadow-glow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save CMS Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
