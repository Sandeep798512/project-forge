import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Tag,
  CheckCircle2,
  GraduationCap,
  Code2,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { ScrollReveal, ScrollStagger } from '../components/common/ScrollReveal';
import { ENGINEERING_GUIDES, EngineeringGuide } from '../data/engineeringGuidesData';

export const ProjectGuides: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Project Selection', 'Full-Stack', 'Viva & Exams', 'Study & PYQs', 'Deployment'];

  const filteredGuides = ENGINEERING_GUIDES.filter((guide) => {
    const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const hubSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Engineering Project Guides & Academic Tutorials | CampusGet',
    description: 'Comprehensive engineering project selection guides, MERN stack tutorials, viva voce questions, and exam preparation roadmaps for computer science students.',
    url: 'https://campusget.vercel.app/guides',
    hasPart: ENGINEERING_GUIDES.map((g) => ({
      '@type': 'Article',
      name: g.title,
      url: `https://campusget.vercel.app/guides/${g.slug}`,
      headline: g.title,
      description: g.excerpt,
    })),
  };

  return (
    <div className="min-h-screen py-10 md:py-16 bg-background">
      <SEOHead
        title="Engineering Project Guides, MERN Tutorials & Viva Defense | CampusGet"
        description="Comprehensive guides for B.Tech CSE students: how to choose major projects, top MERN stack source codes, cracking project viva voce, and university exam preparation."
        keywords="engineering project guides, btech cse final year project guide, mern stack project tutorial, how to crack project viva, aktu exam strategy"
        canonicalPath="/guides"
        structuredData={hubSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HERO SECTION */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400">
            <Compass className="w-4 h-4" />
            <span>Developer Learning & Academic Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineering Project Guides & Tutorials
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            In-depth engineering roadmaps written by software developers to help you choose the best major projects, master modern full-stack architectures, defend your viva with 90%+ marks, and crack campus placements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 pt-2">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IEEE & University Aligned</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Production Code Tips</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free Access</span>
            </div>
          </div>
        </ScrollReveal>

        {/* SEARCH & CATEGORY FILTER */}
        <ScrollReveal animation="fade-up" delay={80} className="bg-surface border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides by topic, technology (e.g. MERN, Viva, Selection, MongoDB, AKTU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/80 border border-border/60 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-glow-sm'
                    : 'bg-background hover:bg-surface text-gray-400 hover:text-white border border-border/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* GUIDES GRID */}
        {filteredGuides.length === 0 ? (
          <div className="bg-surface/50 border border-border/60 rounded-2xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No guides matching your criteria</h3>
            <p className="text-xs text-gray-400">Try adjusting your search query or reset category filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <ScrollStagger staggerDelay={60} animation="fade-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <article
                key={guide.slug}
                className="bg-surface/70 border border-border/80 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                      {guide.category}
                    </span>
                    <span className="flex items-center space-x-1 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.readTime}</span>
                    </span>
                  </div>

                  <Link to={`/guides/${guide.slug}`}>
                    <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                      {guide.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {guide.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {guide.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-gray-400 bg-background/80 px-2 py-0.5 rounded border border-border/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    By {guide.author}
                  </span>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </ScrollStagger>
        )}

        {/* BOTTOM PROMO BANNER */}
        <ScrollReveal animation="fade-up" className="bg-gradient-to-r from-indigo-900/30 via-surface to-purple-900/30 border border-indigo-500/30 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Complete Major Project Packages</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Ready to submit your final year project without panic?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Get full production-grade source code, IEEE project reports (.PDF), presentation decks (.PPTX), database schemas, and 1-on-1 developer setup support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/projects"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-sm transition-all"
            >
              Browse 11+ Projects
            </Link>
            <Link
              to="/study-materials"
              className="px-6 py-3 rounded-xl bg-surface hover:bg-background border border-border text-gray-200 hover:text-white font-semibold text-xs transition-colors"
            >
              Free Notes & PYQs
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
