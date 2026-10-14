import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle, FileText, ShoppingCart, Sparkles, GraduationCap } from 'lucide-react';
import { BRAND } from '../../config/brand.config';

export interface PlacementCardProps {
  material: {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    thumbnail: string;
    careerTrack?: string;
    targetRole?: string;
    pageCount?: number;
    author?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    features?: string[];
  };
}

export const PlacementCard: React.FC<PlacementCardProps> = ({ material }) => {
  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const discountPercent =
    material.discountPercentage ||
    (material.originalPrice && material.originalPrice > material.price
      ? Math.round(((material.originalPrice - material.price) / material.originalPrice) * 100)
      : 0);

  const totalSaved =
    material.originalPrice && material.originalPrice > material.price
      ? material.originalPrice - material.price
      : 0;

  return (
    <div className="bg-surface/80 border border-border/80 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-glow-md transition-all duration-300 flex flex-col group">
      
      {/* Thumbnail Container (Uncropped Original Image View) */}
      <div className="relative aspect-video overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Soft Ambient Blur Layer */}
        <img
          src={material.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-105 pointer-events-none"
        />

        {/* Uncropped Original Main Image */}
        <img
          src={material.thumbnail}
          alt={material.title}
          className="relative z-10 max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 pointer-events-none z-10" />

        {/* Track & Difficulty Pills Top Left */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm bg-amber-500/10 text-amber-300 border-amber-500/30 flex items-center space-x-1">
            <GraduationCap className="w-3 h-3 text-amber-400" />
            <span>{material.careerTrack || 'Placement Prep'}</span>
          </span>
          {material.difficulty && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${
                difficultyColors[material.difficulty] || difficultyColors.Intermediate
              }`}
            >
              {material.difficulty}
            </span>
          )}
        </div>

        {/* Page Count Badge Top Right */}
        {material.pageCount ? (
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-slate-950/80 text-gray-200 border border-border/80 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-xl backdrop-blur-md flex items-center space-x-1">
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>{material.pageCount} Pages</span>
            </span>
          </div>
        ) : null}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Target Role Tag */}
          {material.targetRole && (
            <div className="mb-2">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
                🎯 {material.targetRole}
              </span>
            </div>
          )}

          {/* Title */}
          <Link to={`/placement-prep/${material.slug}`}>
            <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-1">
              {material.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {material.shortDescription}
          </p>
        </div>

        {/* Deliverables Checklist highlight */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center space-x-1 text-emerald-400 font-medium truncate">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Full PDF E-Book • Instant Access • Printable</span>
          </span>
        </div>

        {/* Pricing & Footer Actions (Flipkart Style Discount) */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5 flex-wrap">
              <span className="text-lg font-extrabold text-white">
                {material.price === 0 ? 'FREE' : `${BRAND.currency.symbol}${material.price.toLocaleString('en-IN')}`}
              </span>
              {material.originalPrice && material.originalPrice > material.price && (
                <span className="text-xs text-gray-500 line-through">
                  {BRAND.currency.symbol}{material.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-extrabold text-emerald-400">
                  {discountPercent}% off
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-400 font-medium block">
                Save {BRAND.currency.symbol}{totalSaved.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/placement-prep/${material.slug}`}
              className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border text-gray-200 hover:text-white text-xs font-semibold transition-all"
            >
              Details
            </Link>

            <Link
              to={`/checkout/${material._id}`}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-glow-sm transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Get PDF</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
