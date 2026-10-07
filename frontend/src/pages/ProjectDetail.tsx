import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle2, ShieldCheck, Play, ArrowLeft, Star, FileText, Database, Layers, HelpCircle, Code, ShoppingCart, MessageSquare, Download, Video, Maximize2 } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../services/analytics';
import api from '../services/api';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'deliverables' | 'viva'>('overview');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          trackEvent('project_view', { productId: res.data.product._id, slug });
        }
      } catch (err) {
        console.error('Error loading project details', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleBuyNow = () => {
    if (product?._id) {
      trackEvent('buy_click', { productId: product._id });
    }
    if (!isAuthenticated) {
      navigate(`/login?redirect=/projects/${slug}`);
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Project Package Not Found</h2>
        <p className="text-gray-400 text-sm mt-2">The requested project may have been updated or unlisted.</p>
        <Link to="/projects" className="mt-4 inline-block text-sm font-semibold text-primary-400 hover:underline">
          Back to Projects Catalog
        </Link>
      </div>
    );
  }

  const allImages = [product.thumbnail, ...(product.screenshots || [])].filter(Boolean);
  const currentImgSrc = allImages[activeImageIndex] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/projects" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white mb-6 font-semibold transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Main Grid: Left Details (2/3) + Right Purchase Card (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-primary-500/10 border border-primary-500/20 text-primary-400">
                  {product.category?.name || 'Software Project'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-surface border border-border text-gray-300">
                  Difficulty: {product.difficulty}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-surface border border-border text-emerald-400">
                  v{product.currentVersion}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                {product.title}
              </h1>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {product.shortDescription}
              </p>

              {/* High Visibility Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {product.demoVideoUrl && (
                  <a
                    href={product.demoVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs shadow-glow-sm flex items-center space-x-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span>Watch Demo Video</span>
                  </a>
                )}

                {product.liveDemoUrl && (
                  <a
                    href={product.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-emerald-600 border border-emerald-500/40 text-emerald-400 hover:text-white font-bold text-xs shadow-glow-sm flex items-center space-x-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Live Deployed App</span>
                  </a>
                )}
              </div>
            </div>

            {/* Uncropped Full Image Gallery Viewer */}
            <div className="bg-surface/80 border border-border/80 rounded-2xl overflow-hidden p-2">
              <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center group">
                
                {/* Soft Blurred Background Fill (Fills Aspect Ratio without distortion) */}
                <img
                  src={currentImgSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-20 scale-105 pointer-events-none"
                />

                {/* Main Full Image (Uncropped, 100% Original Ratio Visible) */}
                <img
                  src={currentImgSrc}
                  alt={product.title}
                  className="relative z-10 max-w-full max-h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                  onClick={() => setLightboxOpen(true)}
                  title="Click to view full screen"
                />

                {/* Overlay Action Badges & Lightbox trigger */}
                <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="bg-surface/90 hover:bg-white hover:text-gray-900 text-gray-200 p-2 rounded-xl border border-border backdrop-blur-md transition-all shadow-md"
                    title="Expand Full Screen View"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {product.demoVideoUrl && (
                    <a
                      href={product.demoVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-red-400/40 flex items-center space-x-1.5 shadow-md transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Demo Video</span>
                    </a>
                  )}

                  {product.liveDemoUrl && (
                    <a
                      href={product.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface/90 hover:bg-emerald-600 text-gray-100 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-border flex items-center space-x-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live App Demo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Uncropped Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center space-x-2 mt-2 overflow-x-auto p-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-24 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-950 flex items-center justify-center ${
                        activeImageIndex === idx ? 'border-primary-500 scale-95 shadow-glow-sm' : 'border-border/60 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tech Stack Pills */}
            <div className="bg-surface/50 border border-border/60 rounded-2xl p-5">
              <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-gray-400 mb-3 flex items-center space-x-1.5">
                <Code className="w-4 h-4 text-primary-400" />
                <span>Technology Stack & Integrations</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.techStack.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-mono font-medium bg-background border border-border text-primary-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border/60 flex items-center space-x-4 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition-colors border-b-2 ${
                  activeTab === 'overview' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Overview & Features
              </button>
              <button
                onClick={() => setActiveTab('deliverables')}
                className={`pb-3 transition-colors border-b-2 ${
                  activeTab === 'deliverables' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Package Deliverables
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`pb-3 transition-colors border-b-2 ${
                  activeTab === 'architecture' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Architecture & Database
              </button>
              <button
                onClick={() => setActiveTab('viva')}
                className={`pb-3 transition-colors border-b-2 ${
                  activeTab === 'viva' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Viva & Requirements
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-surface/60 border border-border/60 rounded-2xl p-6 space-y-6">
              
              {activeTab === 'overview' && (
                <div className="space-y-6 text-sm text-gray-300">
                  <div>
                    <h3 className="font-bold text-white text-base mb-2">Project Description</h3>
                    <div className="whitespace-pre-line leading-relaxed text-gray-300">
                      {product.fullDescription}
                    </div>
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-bold text-white text-base mb-3">Key Features & Modules</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.features.map((feat: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2 bg-background/60 p-3 rounded-xl border border-border/40">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-200 font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deliverables' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-white text-base">What You Get In This Package</h3>
                  <div className="space-y-2.5">
                    {product.deliverables.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-background border border-border/60 rounded-xl text-xs sm:text-sm">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-gray-200">{item.name?.replace(/IEEE\s*(Style\s*)?/gi, '')}</span>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          Included
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="space-y-5 text-xs sm:text-sm text-gray-300">
                  <div>
                    <h4 className="font-bold text-white mb-1">System Architecture Overview</h4>
                    <p className="bg-background p-4 rounded-xl border border-border/60 leading-relaxed font-mono text-xs text-gray-300">
                      {product.architectureDetails || 'Modular Decoupled REST Architecture.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Database Model & Storage</h4>
                    <p className="bg-background p-4 rounded-xl border border-border/60 leading-relaxed font-mono text-xs text-gray-300">
                      {product.databaseDetails || 'MongoDB Schema collections with indexing.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'viva' && (
                <div className="space-y-4 text-xs sm:text-sm text-gray-300">
                  <h4 className="font-bold text-white">System Requirements for Local Setup</h4>
                  <ul className="list-disc list-inside space-y-1 font-mono text-xs bg-background p-4 rounded-xl border border-border/60 text-gray-300">
                    {product.requirements?.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT SIDEBAR - PURCHASE BOX */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24 shadow-2xl space-y-5">
              
              {/* Pricing Display (Flipkart Style Auto Discount) */}
              {(() => {
                const discountPercent = product.discountPercentage || (product.originalPrice && product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);
                const totalSaved = product.originalPrice && product.originalPrice > product.price ? product.originalPrice - product.price : 0;

                return (
                  <div className="pb-4 border-b border-border/60">
                    <span className="text-xs text-gray-400 uppercase font-semibold">Package License Price</span>
                    <div className="flex items-baseline space-x-2.5 flex-wrap mt-1">
                      <span className="text-3xl font-extrabold text-white">
                        {BRAND.currency.symbol}{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {BRAND.currency.symbol}{product.originalPrice.toLocaleString('en-IN')}
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
                );
              })()}

              {/* Demo Links Action Section */}
              {(product.demoVideoUrl || product.liveDemoUrl) && (
                <div className="space-y-2 pb-4 border-b border-border/60">
                  <span className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">
                    Interactive Demos & Video
                  </span>
                  
                  {product.demoVideoUrl && (
                    <a
                      href={product.demoVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-sm"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Watch Demo Video</span>
                    </a>
                  )}

                  {product.liveDemoUrl && (
                    <a
                      href={product.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Live App Demo</span>
                    </a>
                  )}
                </div>
              )}

              {/* Quick Deliverable Summary */}
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Instant Download Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Complete Source Code & DB Exports</span>
                </div>
                {(() => {
                  const hasDoc = product.hasDocumentation !== false;
                  const hasPpt = product.hasPPT !== false;
                  const hasViva = product.hasVivaQA !== false;

                  if (!hasDoc && !hasPpt && !hasViva) return null;

                  let label = '';
                  if (hasDoc && hasPpt && hasViva) label = 'Documentation, PPT & Viva QA';
                  else if (hasDoc && hasPpt) label = 'Documentation & PPT Presentation';
                  else if (hasDoc && hasViva) label = 'Documentation & Viva QA';
                  else if (hasPpt && hasViva) label = 'PPT Presentation & Viva QA';
                  else if (hasDoc) label = 'Project Documentation & Report';
                  else if (hasPpt) label = 'PPT Presentation Slides';
                  else if (hasViva) label = 'Viva Voce QA Bank';

                  return (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{label}</span>
                    </div>
                  );
                })()}
                {product.hasSetupSupport !== false && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>WhatsApp Setup Support</span>
                  </div>
                )}
              </div>

              {/* Buy Now CTA */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-base shadow-glow-md transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Buy & Unlock Project Now</span>
              </button>

              <div className="text-center">
                <span className="text-[11px] text-gray-500">
                  Encrypted checkout powered by {BRAND.paymentProvider}
                </span>
              </div>

              {/* WhatsApp Technical Assistance Button */}
              <div className="pt-3 border-t border-border/60 text-center">
                <WhatsAppButton
                  variant="inline"
                  label="Ask Questions on WhatsApp"
                  customMessage={`Hi, I have a question regarding the project: ${product.title}`}
                />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Full Screen Lightbox Modal for Original Image */}
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
              src={currentImgSrc}
              alt="Original High-Res Screenshot"
              className="max-w-full max-h-[90vh] object-contain rounded-xl border border-border/60 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
