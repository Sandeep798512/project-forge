import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, GraduationCap, BookOpen, CheckCircle, ArrowRight, Sparkles, Filter, RefreshCcw } from 'lucide-react';
import { PlacementCard } from '../components/marketplace/PlacementCard';
import { ScrollReveal, ScrollStagger } from '../components/common/ScrollReveal';
import api from '../services/api';

const CAREER_TRACKS = [
  { label: 'All Resources', value: 'ALL' },
  { label: 'Placement Prep', value: 'Placement Prep' },
  { label: 'Career Roadmaps', value: 'Career Roadmap' },
  { label: 'DSA & Coding', value: 'DSA & Coding' },
  { label: 'Core CS (OS/DBMS/CN)', value: 'Core CS (OS, DBMS, CN)' },
  { label: 'System Design', value: 'System Design' },
  { label: 'Resume & HR', value: 'Resume & HR' },
];

export const PlacementPrep: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialPlacement = () => {
    try {
      const cached = localStorage.getItem('cg_cached_placement_prep');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  };

  const [materials, setMaterials] = useState<any[]>(getInitialPlacement);
  const [loading, setLoading] = useState<boolean>(() => {
    const hasCached = getInitialPlacement().length > 0;
    const isDefault = !searchParams.get('search') && (!searchParams.get('track') || searchParams.get('track') === 'ALL');
    return !hasCached || !isDefault;
  });

  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [track, setTrack] = useState<string>(searchParams.get('track') || 'ALL');
  const [difficulty, setDifficulty] = useState<string>(searchParams.get('difficulty') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'createdAt');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Typewriter Animation State (Types at a comfortable pace exactly 1 time on page load, then permanently stops)
  const fullHeadingText = 'Placement Roadmaps, DSA Sheets & Tech Interview E-Books';
  const [typedHeading, setTypedHeading] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return fullHeadingText;
    }
    return '';
  });
  const [typingStopped, setTypingStopped] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typingStopped) return;

    if (typedHeading.length >= fullHeadingText.length) {
      setTypingStopped(true);
      return;
    }

    const timer = setTimeout(() => {
      setTypedHeading(fullHeadingText.substring(0, typedHeading.length + 1));
    }, 75);

    return () => clearTimeout(timer);
  }, [typedHeading, typingStopped]);

  useEffect(() => {
    fetchMaterials();
  }, [search, track, difficulty, sort, page]);

  const fetchMaterials = async () => {
    try {
      const isDefault = !search && track === 'ALL' && !difficulty && sort === 'createdAt' && page === 1;
      if (!isDefault && materials.length === 0) {
        setLoading(true);
      }
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (track && track !== 'ALL') params.set('track', track);
      if (difficulty) params.set('difficulty', difficulty);
      if (sort) params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', '12');

      const res = await api.get(`/placement-prep?${params.toString()}`);
      if (res.data.success) {
        setMaterials(res.data.materials);
        setTotalPages(res.data.pagination.pages || 1);
        if (isDefault) {
          localStorage.setItem('cg_cached_placement_prep', JSON.stringify(res.data.materials));
        }
      }
    } catch (err) {
      console.error('[FETCH PLACEMENT PREP ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackChange = (selectedTrack: string) => {
    setTrack(selectedTrack);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (selectedTrack === 'ALL') {
      newParams.delete('track');
    } else {
      newParams.set('track', selectedTrack);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearch('');
    setTrack('ALL');
    setDifficulty('');
    setSort('createdAt');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HERO BANNER */}
        <ScrollReveal animation="fade-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/40 via-surface to-surface border border-amber-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Ambient Background Glow behind Image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Content Column */}
            <div className="relative z-10 max-w-2xl space-y-4 flex-1 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 backdrop-blur-md">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Career & Placement Preparation Suite</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight min-h-[72px] sm:min-h-[110px]">
                {typedHeading || (typingStopped ? fullHeadingText : '')}
                {!typingStopped && (
                  <span className="animate-pulse text-amber-400 font-mono font-light ml-0.5">|</span>
                )}
              </h1>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Curated, high-yield preparation handbooks for CSE & IT students. Get complete roadmaps, top 450 DSA patterns, core CS cheatsheets (OS/DBMS/CN), and company-specific interview blueprints with instant PDF download access.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 pt-2">
                <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" /> Instant PDF Downloads
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" /> Printable & Mobile-Friendly
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" /> Lifetime Access & Re-downloads
                </span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="relative z-10 flex-shrink-0 w-full sm:w-80 md:w-96 lg:w-[380px] xl:w-[420px] flex items-center justify-center">
              <div className="relative group rounded-2xl overflow-hidden border border-amber-500/30 bg-surface/90 shadow-2xl p-2 transition-all duration-300 hover:border-amber-400/60 hover:shadow-glow-md">
                
                {/* Soft ambient inner blur glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-cyan-500/10 pointer-events-none z-10" />

                <img
                  src="/placement-prep-hero.jpg"
                  alt="Software Engineer Career Roadmap & DSA Coding Interview Preparation"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto aspect-square object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Floating highlight badge over image */}
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md border border-amber-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-white tracking-wide">
                      Top SDE & Tech Roadmaps
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    2026 Edition
                  </span>
                </div>

              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* SEARCH & FILTERS BAR */}
        <ScrollReveal animation="fade-up" delay={80} className="bg-surface/80 border border-border/80 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search DSA, LeetCode, Full Stack Roadmap, TCS, Operating Systems..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-auto"
            >
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner (1st - 2nd Year)</option>
              <option value="Intermediate">Intermediate (Pre-Final Year)</option>
              <option value="Advanced">Advanced (Final Year / Off-Campus)</option>
            </select>

            {/* Sort Order */}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-auto"
            >
              <option value="createdAt">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            {(search || track !== 'ALL' || difficulty) && (
              <button
                onClick={handleResetFilters}
                className="p-2.5 rounded-xl bg-surface hover:bg-surface-hover border border-border text-gray-400 hover:text-white transition-colors"
                title="Reset Filters"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            )}

          </div>

          {/* Track Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CAREER_TRACKS.map((t) => {
              const active = track === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => handleTrackChange(t.value)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-sm'
                      : 'bg-surface hover:bg-surface-hover border border-border/80 text-gray-300 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

        </ScrollReveal>

        {/* MATERIAL GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-surface/50 rounded-2xl animate-pulse border border-border/40" />
            ))}
          </div>
        ) : materials.length > 0 ? (
          <ScrollStagger
            staggerDelay={70}
            animation="fade-up"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {materials.map((item) => (
              <PlacementCard key={item._id} material={item} />
            ))}
          </ScrollStagger>
        ) : (
          <div className="text-center py-16 bg-surface/40 rounded-2xl border border-border/60 space-y-3">
            <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Placement Materials Found</h3>
            <p className="text-gray-400 text-xs max-w-sm mx-auto">
              Try adjusting your search keywords or clearing your active filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 text-xs font-semibold text-amber-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-gray-300 disabled:opacity-40 hover:text-white"
            >
              Previous
            </button>
            <span className="text-xs font-mono text-gray-400 px-3">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-gray-300 disabled:opacity-40 hover:text-white"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
