import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ShoppingCart, MessageSquare } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import api from '../services/api';

export const CampaignPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCampaignProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error('Campaign page load error', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCampaignProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Campaign Offer Not Found</h2>
        <Link to="/projects" className="mt-4 inline-block text-sm font-semibold text-primary-400">
          Browse All Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Campaign Offer Banner */}
        <div className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 p-0.5 rounded-2xl shadow-glow-lg">
          <div className="bg-surface rounded-2xl p-6 text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Instagram Code Offer</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {product.title}
            </h1>
            <p className="text-gray-300 text-sm max-w-lg mx-auto">
              You found this from our Instagram Reel! Get the complete production package with 100% executable source code, documentation, PPT & setup guide.
            </p>
          </div>
        </div>

        {/* Product Highlights Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
          <div className="aspect-video rounded-xl overflow-hidden bg-surface-hover">
            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-baseline justify-between border-b border-border/60 pb-4">
            <div>
              <span className="text-xs text-gray-400">Exclusive Bundle Price</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold text-white">
                  {BRAND.currency.symbol}{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {BRAND.currency.symbol}{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            {product.discountPercentage && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Complete Source Code (Frontend + Backend + DB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Academic Presentation PPTX + PDF Documentation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Viva Voce Question & Answer Defense Guide</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Developer Setup Assistance</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to={`/projects/${product.slug}`}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-center text-sm shadow-glow-sm"
            >
              Get Instant Access Now
            </Link>
            {product.liveDemoUrl && (
              <a
                href={product.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-5 rounded-xl bg-surface-hover border border-border text-gray-200 font-semibold text-center text-sm hover:text-white"
              >
                View Live Demo
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
