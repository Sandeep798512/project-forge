import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowRight, Sparkles, Code2, ShieldCheck, Play, CheckCircle, Zap } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { ProjectCard } from '../components/marketplace/ProjectCard';
import { TrustSection } from '../components/marketplace/TrustSection';
import { HowItWorks } from '../components/marketplace/HowItWorks';
import { FAQSection } from '../components/marketplace/FAQSection';
import { CategoryFilter, CategoryItem } from '../components/marketplace/CategoryFilter';
import api from '../services/api';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products?limit=6${selectedCategory ? `&category=${selectedCategory}` : ''}`),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.products);
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
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-accent-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 bg-surface/80 border border-primary-500/30 px-4 py-1.5 rounded-full text-xs font-medium text-primary-300 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>Production-Ready Developer Marketplace for CSE/IT</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Build Projects That You Can{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-cyan-400">
                Actually Explain.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Production-style software projects with complete source code, documentation, setup guides, and technical support — designed to help students learn, customize, and showcase real development work.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-7 py-3.5 rounded-xl shadow-glow-md transition-all duration-200"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#featured"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-surface/80 hover:bg-surface-hover text-gray-200 border border-border/80 font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                <Play className="w-4 h-4 text-primary-400 fill-current" />
                <span>View Live Demos</span>
              </a>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-gray-400">
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
                <span>WhatsApp Developer Support</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Preview */}
          <div className="mt-14 max-w-5xl mx-auto relative rounded-2xl p-1.5 bg-gradient-to-b from-primary-500/30 via-border/50 to-border/20 shadow-2xl">
            <div className="bg-surface rounded-xl overflow-hidden border border-border/80">
              {/* Window Bar */}
              <div className="bg-background/90 px-4 py-3 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-gray-400">
                    projectforge-workspace ~ node src/server.ts
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  HEALTHY • 200 OK
                </span>
              </div>

              {/* Mock Developer Terminal View */}
              <div className="p-6 font-mono text-xs space-y-3 bg-[#0B0F19] text-gray-300 overflow-x-auto">
                <div className="text-gray-500">// Welcome to ProjectForge Developer Workspace</div>
                <div className="flex items-center space-x-2 text-primary-400">
                  <span>$</span>
                  <span className="text-white">git clone https://github.com/projectforge-dev/ai-resume-analyzer.git</span>
                </div>
                <div className="text-emerald-400">✓ Repository cloned successfully</div>
                <div className="flex items-center space-x-2 text-primary-400">
                  <span>$</span>
                  <span className="text-white">npm install && npm run seed && npm run dev</span>
                </div>
                <div className="text-gray-400">
                  [DB] Connected to MongoDB Atlas instance<br />
                  [AI Engine] Gemini 1.5 Flash initialized<br />
                  [SERVER] Ready at http://localhost:5000 (React Frontend: http://localhost:5173)
                </div>
                <div className="pt-2 flex items-center space-x-2 text-accent-400">
                  <Zap className="w-4 h-4 text-accent-400 animate-pulse" />
                  <span>Package Ready: Includes Source Code + PDF Report + PPTX + Viva QA Bank</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section id="featured" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1 rounded-full text-xs font-semibold text-primary-400 mb-2">
                <Code2 className="w-3.5 h-3.5" />
                <span>Featured Developer Software Packages</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Explore Industry-Style Projects
              </h2>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center space-x-1.5 text-primary-400 hover:text-primary-300 font-semibold text-sm transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="mb-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          )}

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-surface/50 rounded-2xl animate-pulse border border-border/40" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProjectCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface/40 rounded-2xl border border-border/60">
              <p className="text-gray-400 text-sm">No project packages found in this category.</p>
              <button
                onClick={() => setSelectedCategory('')}
                className="mt-3 text-xs font-semibold text-primary-400 hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}

        </div>
      </section>

      {/* TRUST & WHAT YOU GET */}
      <TrustSection />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* FAQ SECTION */}
      <FAQSection />

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-surface/80 to-background border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Build and Defense Your Next Major Project?
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto">
            Get instant access to complete source code, architectural documentation, presentation slides, and WhatsApp developer support.
          </p>
          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold px-8 py-4 rounded-xl shadow-glow-lg transition-all duration-200 text-base"
            >
              <span>Explore Marketplace Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
