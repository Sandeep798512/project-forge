import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Download,
  ShoppingCart,
  GraduationCap,
  Sparkles,
  Maximize2,
  FileText,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { SEOHead } from '../components/common/SEOHead';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../services/analytics';
import api from '../services/api';

export const PlacementPrepDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [material, setMaterial] = useState<any | null>(null);
  const [relatedMaterials, setRelatedMaterials] = useState<any[]>([]);
  const [isOwned, setIsOwned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'deliverables'>('overview');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchMaterial();
  }, [slug]);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/placement-prep/${slug}`);
      if (res.data.success) {
        setMaterial(res.data.material);
        setIsOwned(Boolean(res.data.isOwned));
        setRelatedMaterials(res.data.relatedMaterials || []);
        trackEvent('project_view', { productId: res.data.material._id, slug });
      }
    } catch (err) {
      console.error('[FETCH PLACEMENT PREP DETAIL ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!material?._id) return;
    trackEvent('buy_click', { productId: material._id });

    if (!isAuthenticated) {
      navigate(`/login?redirect=/placement-prep/${slug}`);
      return;
    }

    navigate(`/checkout/${material._id}`);
  };

  const handleDirectDownload = async () => {
    if (!material?._id) return;
    try {
      setDownloading(true);
      const asset = material.assets?.[0];
      const assetId = asset ? asset._id : 'default';

      const res = await api.post(`/downloads/${material._id}/assets/${assetId}/request`);
      if (res.data.success && res.data.downloadUrl) {
        if (res.data.mimeType === 'application/pdf') {
          window.open(res.data.downloadUrl, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = res.data.downloadUrl;
          link.download = asset?.originalName || `${material.slug}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        alert(res.data.message || 'Download request error');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to download file. Please visit My Purchases.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-background py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Placement Material Not Found</h2>
        <p className="text-gray-400 text-sm">The requested placement guide or roadmap may have been updated or unlisted.</p>
        <Link
          to="/placement-prep"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-amber-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Placement & Roadmaps</span>
        </Link>
      </div>
    );
  }

  const discountPercent =
    material.discountPercentage ||
    (material.originalPrice && material.originalPrice > material.price
      ? Math.round(((material.originalPrice - material.price) / material.originalPrice) * 100)
      : 0);

  const totalSaved =
    material.originalPrice && material.originalPrice > material.price
      ? material.originalPrice - material.price
      : 0;

  const prepSchema = material ? {
    '@context': 'https://schema.org/',
    '@type': 'Book',
    name: material.title,
    description: material.shortDescription || material.title,
    image: material.thumbnail
      ? (material.thumbnail.startsWith('http') ? material.thumbnail : `https://campusget.vercel.app${material.thumbnail}`)
      : 'https://campusget.vercel.app/campusget-icon-light-tile.png',
    author: {
      '@type': 'Organization',
      name: 'CampusGet',
    },
    numberOfPages: material.pageCount || 50,
    offers: {
      '@type': 'Offer',
      url: `https://campusget.vercel.app/placement-prep/${material.slug}`,
      priceCurrency: 'INR',
      price: material.price,
      availability: 'https://schema.org/InStock',
    },
  } : undefined;

  return (
    <div className="py-10 bg-background min-h-screen">
      <SEOHead
        title={`${material.title} - Placement Prep Guide`}
        description={material.shortDescription || `Download ${material.title} placement preparation guide, interview Q&As & roadmap on CampusGet.`}
        keywords={`${material.careerTrack || 'placement prep'}, ${material.targetRole || 'tech interview'}, interview questions, placement handbook, CampusGet`}
        canonicalPath={`/placement-prep/${slug}`}
        ogImage={material.thumbnail?.startsWith('http') ? material.thumbnail : `https://campusget.vercel.app${material.thumbnail || '/campusget-icon-light-tile.png'}`}
        ogType="article"
        structuredData={prepSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          to="/placement-prep"
          className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Placement & Roadmaps</span>
        </Link>

        {/* Main Grid: Left Details (2/3) + Right Purchase Card (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{material.careerTrack || 'Placement Prep'}</span>
                </span>
                {material.targetRole && (
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-surface border border-border text-gray-300">
                    🎯 {material.targetRole}
                  </span>
                )}
                {material.difficulty && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-surface border border-border text-gray-300">
                    Level: {material.difficulty}
                  </span>
                )}
                {material.pageCount ? (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-surface border border-border text-emerald-400">
                    {material.pageCount} Pages • PDF
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                {material.title}
              </h1>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {material.shortDescription}
              </p>

              <div className="text-xs text-gray-400 flex items-center space-x-2 pt-1 font-mono">
                <span>Curated by:</span>
                <span className="text-gray-200 font-semibold">{material.author || 'CampusGet Placement Cell'}</span>
              </div>
            </div>

            {/* Uncropped Full Cover Viewer */}
            <div className="bg-surface/80 border border-border/80 rounded-2xl overflow-hidden p-2">
              <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center group">
                <img
                  src={material.thumbnail}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-20 scale-105 pointer-events-none"
                />

                <img
                  src={material.thumbnail}
                  alt={material.title}
                  className="relative z-10 max-w-full max-h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                  onClick={() => setLightboxOpen(true)}
                  title="Click to expand full screen view"
                />

                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="bg-surface/90 hover:bg-white hover:text-gray-900 text-gray-200 p-2 rounded-xl border border-border backdrop-blur-md transition-all shadow-md"
                    title="Expand Full Screen View"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Highlights Checklist */}
            {material.features && material.features.length > 0 && (
              <div className="bg-surface/50 border border-border/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Key Preparation Highlights & Coverage</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {material.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2 bg-background/60 p-2.5 rounded-xl border border-border/40 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="border-b border-border/60 flex items-center space-x-4 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition-colors border-b-2 ${
                  activeTab === 'overview' ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Detailed Syllabus & Modules
              </button>
              <button
                onClick={() => setActiveTab('deliverables')}
                className={`pb-3 transition-colors border-b-2 ${
                  activeTab === 'deliverables' ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Included Deliverables
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-surface/60 border border-border/60 rounded-2xl p-6 space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-4 text-sm text-gray-300">
                  <h3 className="font-bold text-white text-base">Complete Course & Table of Contents</h3>
                  <div className="whitespace-pre-line leading-relaxed text-gray-300 font-sans">
                    {material.fullDescription}
                  </div>
                </div>
              )}

              {activeTab === 'deliverables' && (
                <div className="space-y-4 text-sm">
                  <h3 className="font-bold text-white text-base">What You Receive Immediately Upon Purchase</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-background border border-border/60 rounded-xl text-xs sm:text-sm">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-gray-200">Full Printable High-Res PDF Document</span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        Included
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-background border border-border/60 rounded-xl text-xs sm:text-sm">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-gray-200">1-Page Fast Revision Cheatsheet</span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        Included
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-background border border-border/60 rounded-xl text-xs sm:text-sm">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-gray-200">Lifetime Re-download Access & Updates</span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        Included
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Related Placement Materials */}
            {relatedMaterials.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border/60">
                <h3 className="font-bold text-lg text-white">Recommended Alongside This Guide</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedMaterials.map((item) => (
                    <Link
                      key={item._id}
                      to={`/placement-prep/${item.slug}`}
                      className="bg-surface/80 border border-border/60 hover:border-amber-500/40 p-3 rounded-xl block transition-all group"
                    >
                      <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden mb-2">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="text-xs font-bold text-gray-200 group-hover:text-amber-400 line-clamp-1">{item.title}</h4>
                      <span className="text-xs font-bold text-white mt-1 block">
                        {BRAND.currency.symbol}{item.price.toLocaleString('en-IN')}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR - PURCHASE BOX */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24 shadow-2xl space-y-5">
              
              {/* Pricing Display */}
              <div className="pb-4 border-b border-border/60">
                <span className="text-xs text-gray-400 uppercase font-semibold">One-Time E-Book License</span>
                <div className="flex items-baseline space-x-2.5 flex-wrap mt-1">
                  <span className="text-3xl font-extrabold text-white">
                    {material.price === 0 ? 'FREE' : `${BRAND.currency.symbol}${material.price.toLocaleString('en-IN')}`}
                  </span>
                  {material.originalPrice && material.originalPrice > material.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {BRAND.currency.symbol}{material.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-sm font-extrabold text-emerald-400">
                      {discountPercent}% off
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <div className="mt-2 inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                    <span>🔥 You Save {BRAND.currency.symbol}{totalSaved.toLocaleString('en-IN')} ({discountPercent}% OFF)</span>
                  </div>
                )}
              </div>

              {/* Ownership Status or Buy Button */}
              {isOwned ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold block">Purchased & Active</span>
                      <span className="text-gray-300 text-[11px]">You have full ownership of this guide. You can download or view it anytime.</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDirectDownload}
                    disabled={downloading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-base shadow-glow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>{downloading ? 'Preparing PDF...' : 'Download PDF E-Book'}</span>
                  </button>

                  <Link
                    to="/dashboard/purchases"
                    className="block text-center text-xs text-primary-400 hover:underline pt-1"
                  >
                    View in My Purchases →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-base shadow-glow-md transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Buy & Unlock PDF Now</span>
                  </button>

                  <div className="space-y-2 text-xs text-gray-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Instant Direct PDF Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Printable & Mobile Friendly</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Lifetime Access & Free Re-downloads</span>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-gray-500 flex items-center justify-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Encrypted checkout via {BRAND.paymentProvider}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* WhatsApp Support Button */}
              <div className="pt-3 border-t border-border/60 text-center">
                <WhatsAppButton
                  variant="inline"
                  label="Ask Placement Query on WhatsApp"
                  customMessage={`Hi, I have a question regarding the placement guide: ${material.title}`}
                />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Full Screen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[92vh] flex items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-gray-300 hover:text-white font-bold text-sm bg-surface/80 px-3 py-1 rounded-lg border border-border"
            >
              ✕ Close (ESC)
            </button>
            <img
              src={material.thumbnail}
              alt="High-Res Cover Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-xl border border-border/60 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
