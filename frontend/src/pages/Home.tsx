import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowRight, Sparkles, Code2, ShieldCheck, Play, CheckCircle, Zap, BookOpen, Download, GraduationCap } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { ProjectCard } from '../components/marketplace/ProjectCard';
import { TrustSection } from '../components/marketplace/TrustSection';
import { HowItWorks } from '../components/marketplace/HowItWorks';
import { FAQSection } from '../components/marketplace/FAQSection';
import { CategoryFilter, CategoryItem } from '../components/marketplace/CategoryFilter';
import { HeroBackground } from '../components/common/HeroBackground';
import api from '../services/api';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Typewriter Animation State
  const phrases = [
    'Actually Explain.',
    'Confidently Defend.',
    'Ship & Deploy Today.',
    'Showcase to Recruiters.',
  ];
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [typingSpeed, setTypingSpeed] = useState(90);

  useEffect(() => {
    const handleType = () => {
      const currentPhraseIndex = loopNum % phrases.length;
      const fullPhrase = phrases[currentPhraseIndex];

      if (isDeleting) {
        setTypedText(fullPhrase.substring(0, typedText.length - 1));
        setTypingSpeed(40);
      } else {
        setTypedText(fullPhrase.substring(0, typedText.length + 1));
        setTypingSpeed(90);
      }

      if (!isDeleting && typedText === fullPhrase) {
        setTypingSpeed(2200); // Pause for 2.2 seconds when full phrase typed
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(100);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed]);

  useEffect(() => {
    // Instant cache read for 0ms page load
    const cachedCategories = localStorage.getItem('cg_cached_categories');
    const cachedFeatured = localStorage.getItem('cg_cached_featured');

    if (cachedCategories) {
      try { setCategories(JSON.parse(cachedCategories)); } catch (e) {}
    }
    if (cachedFeatured && !selectedCategory) {
      try {
        const parsed = JSON.parse(cachedFeatured);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFeaturedProducts(parsed);
          setLoading(false);
        }
      } catch (e) {}
    }

    const fetchData = async () => {
      try {
        // Only set loading true if no cached data exists
        if (!cachedFeatured || selectedCategory) {
          setLoading(true);
        }
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products?limit=6${selectedCategory ? `&category=${selectedCategory}` : ''}`),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.categories);
          localStorage.setItem('cg_cached_categories', JSON.stringify(catRes.data.categories));
        }
        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.products);
          if (!selectedCategory) {
            localStorage.setItem('cg_cached_featured', JSON.stringify(prodRes.data.products));
          }
        }
      } catch (error) {
        console.error('Failed to load homepage data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-border/40">
        
        {/* Dedicated Ambient Background Layer (Blobs, SVG Network & Floating Particles) */}
        <HeroBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 bg-surface/80 border border-primary-500/30 px-4 py-1.5 rounded-full text-xs font-medium text-primary-300 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>Production-Ready Developer Marketplace for CSE/IT</span>
            </div>

            {/* Main Headline with Live Typewriter Effect */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight min-h-[100px] sm:min-h-[140px]">
              Build Projects That You Can{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-cyan-400">
                {typedText}
              </span>
              <span className="animate-pulse text-accent-400 font-mono font-light ml-0.5">|</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              Production-style software projects with complete source code & setup guides — plus <strong className="text-amber-400 font-semibold">Placement Prep Guides & Career Roadmaps</strong> and <strong className="text-emerald-400 font-semibold">100% Free Study Materials & PYQs</strong> to help CSE/IT students learn, build, crack interviews, and excel.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                to="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-6 py-3.5 rounded-xl shadow-glow-md transition-all duration-200"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/study-materials"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold px-6 py-3.5 rounded-xl transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Free Notes & PYQs</span>
              </Link>

              <Link
                to="/placement-prep"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 font-semibold px-6 py-3.5 rounded-xl shadow-glow-sm transition-all duration-200"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Placement & Roadmaps</span>
              </Link>
            </div>

            {/* Trust Micro Features */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>100% Executable Source Code</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Documentation & PPT Included</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Free Study Notes & PYQs</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>Placement Guides & Roadmaps</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS CATALOG SECTION */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-primary-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
                <Terminal className="w-4 h-4" />
                <span>Curated Project Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Featured Production Software Projects
              </h2>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center space-x-1 text-sm font-semibold text-primary-400 hover:text-primary-300"
            >
              <span>View All Projects Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-surface/50 rounded-2xl animate-pulse border border-border/40" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProjectCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface/40 rounded-2xl border border-border/60">
              <p className="text-gray-400 text-sm">No projects found in this category.</p>
            </div>
          )}

        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* TRUST & AUDIENCE */}
      <TrustSection />

      {/* FREE STUDY MATERIALS PROMO BANNER */}
      <section className="py-16 bg-surface/60 border-y border-border/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-emerald-950/60 via-surface to-surface border border-emerald-500/30 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>100% Free Resources For Students</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Free Study Materials, Lecture Notes & PYQs
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Access verified university lecture notes, previous year exam questions (PYQs), lab manuals, and syllabus copies for Computer Science & IT — completely free with instant direct downloads.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 pt-2">
                <span className="flex items-center space-x-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> AKTU / VTU / DU Aligned</span>
                <span className="flex items-center space-x-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> No Login Required</span>
                <span className="flex items-center space-x-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> PDF & Document Downloads</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
              <Link
                to="/study-materials"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-4 rounded-2xl shadow-glow-sm transition-all duration-200 text-sm"
              >
                <span>Explore Free Materials</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PLACEMENT & ROADMAPS PROMO BANNER */}
      <section className="py-16 bg-background relative overflow-hidden border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-amber-950/50 via-surface to-surface border border-amber-500/30 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Crack On-Campus & Off-Campus Hiring</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Placement Prep Guides, DSA Sheets & 2026 Roadmaps
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Step-by-step career blueprints, top 450 DSA patterns with optimal solutions, Core CS viva handbooks (OS, DBMS, CN), and company-specific preparation guides with instant PDF downloads.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 pt-2">
                <span className="flex items-center space-x-1.5"><CheckCircle className="w-4 h-4 text-amber-400" /> SDE & Tech Roles</span>
                <span className="flex items-center space-x-1.5"><CheckCircle className="w-4 h-4 text-amber-400" /> Printable Cheatsheets</span>
                <span className="flex items-center space-x-1.5"><CheckCircle className="w-4 h-4 text-amber-400" /> Lifetime Re-downloads</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
              <Link
                to="/placement-prep"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold px-7 py-4 rounded-2xl shadow-glow-sm transition-all duration-200 text-sm"
              >
                <span>Explore Placement Roadmaps</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

    </div>
  );
};
