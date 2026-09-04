import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, ArrowRight, Code2, Sparkles, CheckCircle, Play } from 'lucide-react';
import { BRAND } from '../../config/brand.config';

export interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    thumbnail: string;
    techStack: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    liveDemoUrl?: string;
    demoVideoUrl?: string;
    ratingAverage?: number;
    ratingCount?: number;
    category?: { name: string; slug: string } | any;
  };
}

export const ProjectCard: React.FC<ProductCardProps> = ({ product }) => {
  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="bg-surface/80 border border-border/80 rounded-2xl overflow-hidden hover:border-primary-500/50 hover:shadow-glow-md transition-all duration-300 flex flex-col group">
      
      {/* Thumbnail Container (Uncropped Original Image View) */}
      <div className="relative aspect-video overflow-hidden bg-slate-950 flex items-center justify-center">
        
        {/* Soft Ambient Blur Layer */}
        <img
          src={product.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-105 pointer-events-none"
        />

        {/* Uncropped Original Main Image */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="relative z-10 max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 pointer-events-none z-10" />
        
        {/* Difficulty Pill */}
        <div className="absolute top-3 left-3 z-20">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${difficultyColors[product.difficulty] || difficultyColors.Intermediate}`}>
            {product.difficulty}
          </span>
        </div>

        {/* Action Buttons Top Right */}
        <div className="absolute top-3 right-3 z-20 flex items-center space-x-1.5">
          {product.demoVideoUrl && (
            <a
              href={product.demoVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600/90 hover:bg-red-600 text-white p-2 sm:px-2.5 sm:py-1 rounded-xl border border-red-400/40 transition-all text-xs font-bold flex items-center space-x-1 backdrop-blur-md shadow-md"
              title="Watch Video Demo"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Video</span>
            </a>
          )}

          {product.liveDemoUrl && (
            <a
              href={product.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface/90 hover:bg-emerald-600 text-gray-200 hover:text-white p-2 sm:px-2.5 sm:py-1 rounded-xl border border-border/60 transition-all text-xs font-bold flex items-center space-x-1 backdrop-blur-md"
              title="Open Live Interactive Demo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {product.techStack.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-background/80 border border-border/40 text-gray-300"
              >
                {tech}
              </span>
            ))}
            {product.techStack.length > 4 && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-background/50 text-gray-400">
                +{product.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/projects/${product.slug}`}>
            <h3 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Deliverables Checklist highlight */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center space-x-1 text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Code + PPT + Report</span>
          </span>
          {product.ratingAverage && (
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-gray-200">{product.ratingAverage.toFixed(1)}</span>
              {product.ratingCount ? <span className="text-gray-500">({product.ratingCount})</span> : null}
            </div>
          )}
        </div>

        {/* Pricing & Footer Actions (Flipkart Style Discount) */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5 flex-wrap">
              <span className="font-extrabold text-xl text-white">
                {BRAND.currency.symbol}{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {BRAND.currency.symbol}{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {(() => {
                const discountPercent = product.discountPercentage || (product.originalPrice && product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);
                return discountPercent > 0 ? (
                  <span className="text-xs font-extrabold text-emerald-400">
                    {discountPercent}% off
                  </span>
                ) : null;
              })()}
            </div>
          </div>

          <Link
            to={`/projects/${product.slug}`}
            className="inline-flex items-center space-x-1 bg-primary-600/20 hover:bg-primary-600 text-primary-300 hover:text-white border border-primary-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group/btn"
          >
            <span>View Package</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
