import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  BookOpen,
  Code2,
  GraduationCap,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_FEATURED_PRODUCTS,
  INITIAL_PLACEMENT_PREP,
  INITIAL_STUDY_MATERIALS,
} from '../../data/initialMarketplaceData';

const POPULAR_SEARCHES = [
  'MERN Stack',
  'AI Resume',
  'SQL Interview',
  'Big Data',
  'Campus Placement',
  'Python',
  'School ERP',
];

interface SearchResultItem {
  id: string;
  type: 'project' | 'note' | 'prep';
  title: string;
  subtitle: string;
  badge: string;
  badgeStyle: string;
  price?: string;
  url: string;
}

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<'all' | 'projects' | 'notes' | 'prep'>('all');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Multi-Category Search Index across Projects, Notes & Placement Prep
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. Projects pool (cached or preloaded)
    let projectsList: any[] = INITIAL_FEATURED_PRODUCTS;
    try {
      const cached = localStorage.getItem('cg_cached_projects') || localStorage.getItem('cg_cached_catalog');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) projectsList = parsed;
      }
    } catch {}

    // 2. Study Materials pool
    let notesList: any[] = INITIAL_STUDY_MATERIALS;
    try {
      const cached = localStorage.getItem('cg_cached_study_materials');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) notesList = parsed;
      }
    } catch {}

    // 3. Placement Prep pool
    let prepList: any[] = INITIAL_PLACEMENT_PREP;
    try {
      const cached = localStorage.getItem('cg_cached_placement_prep') || localStorage.getItem('cg_cached_prep');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) prepList = parsed;
      }
    } catch {}

    if (!q) {
      return { projects: [], notes: [], preps: [], totalCount: 0 };
    }

    const matchedProjects: SearchResultItem[] = [];
    for (const p of projectsList) {
      const t = (p.title || '').toLowerCase();
      const desc = (p.shortDescription || '').toLowerCase();
      const stack = Array.isArray(p.techStack) ? p.techStack.join(' ').toLowerCase() : '';
      const cat = typeof p.category === 'object' && p.category?.name ? p.category.name.toLowerCase() : '';
      if (t.includes(q) || desc.includes(q) || stack.includes(q) || cat.includes(q)) {
        matchedProjects.push({
          id: p._id,
          type: 'project',
          title: p.title,
          subtitle:
            Array.isArray(p.techStack) && p.techStack.length > 0
              ? p.techStack.slice(0, 3).join(' • ')
              : p.category?.name || 'Software Project',
          badge: 'Project',
          badgeStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          price: p.price !== undefined ? `₹${p.price}` : undefined,
          url: `/projects/${p.slug}`,
        });
      }
    }

    const matchedNotes: SearchResultItem[] = [];
    for (const n of notesList) {
      const t = (n.title || '').toLowerCase();
      const subj = (n.subject || '').toLowerCase();
      const uni = (n.university || '').toLowerCase();
      const br = (n.branch || '').toLowerCase();
      const mType = (n.materialType || '').toLowerCase();
      if (t.includes(q) || subj.includes(q) || uni.includes(q) || br.includes(q) || mType.includes(q)) {
        matchedNotes.push({
          id: n._id,
          type: 'note',
          title: n.title,
          subtitle: `${n.subject || 'Study Material'}${n.university ? ` • ${n.university}` : ''}${n.semester ? ` • Sem ${n.semester}` : ''}`,
          badge: n.materialType === 'PYQ' ? 'PYQ' : 'Notes',
          badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          price: 'FREE',
          url: `/study-materials?search=${encodeURIComponent(n.subject || n.title)}`,
        });
      }
    }

    const matchedPreps: SearchResultItem[] = [];
    for (const pr of prepList) {
      const t = (pr.title || '').toLowerCase();
      const desc = (pr.shortDescription || '').toLowerCase();
      const track = (pr.careerTrack || '').toLowerCase();
      const role = (pr.targetRole || '').toLowerCase();
      if (t.includes(q) || desc.includes(q) || track.includes(q) || role.includes(q)) {
        matchedPreps.push({
          id: pr._id,
          type: 'prep',
          title: pr.title,
          subtitle: `${pr.careerTrack || 'Placement'}${pr.targetRole ? ` • ${pr.targetRole}` : ''}`,
          badge: 'E-Book / Prep',
          badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          price: pr.price ? `₹${pr.price}` : 'FREE',
          url: `/placement-prep/${pr.slug}`,
        });
      }
    }

    return {
      projects: matchedProjects,
      notes: matchedNotes,
      preps: matchedPreps,
      totalCount: matchedProjects.length + matchedNotes.length + matchedPreps.length,
    };
  }, [searchQuery]);

  const handleItemClick = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(url);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    const q = encodeURIComponent(searchQuery.trim());
    if (searchTab === 'notes') {
      navigate(`/study-materials?search=${q}`);
    } else if (searchTab === 'prep') {
      navigate(`/placement-prep?search=${q}`);
    } else {
      navigate(`/projects?search=${q}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <img
              src="/campusget-icon-light-tile.png"
              alt={BRAND.name}
              className="w-10 h-10 rounded-xl object-contain shadow-glow-sm group-hover:scale-105 transition-transform duration-200"
            />
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-primary-400">
                {BRAND.name}
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-mono tracking-widest text-primary-400 font-semibold">
                PRO MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Quick Search with Multi-Category Live Dropdown (Laptop / Desktop) */}
          <div
            ref={searchContainerRef}
            className="relative hidden md:flex flex-1 max-w-xs md:max-w-sm lg:max-w-md focus-within:lg:max-w-xl transition-all duration-300 mx-2 lg:mx-4"
          >
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search projects, notes, PYQs, e-books..."
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isSearchOpen) setIsSearchOpen(true);
                  }}
                  className="w-full bg-surface/90 border border-border/70 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* LAPTOP / DESKTOP ENLARGED DROPDOWN (Niche aa kar thodi lambhi) */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 mt-2 w-[480px] lg:w-[600px] max-w-[calc(100vw-2rem)] bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[500px] animate-fade-in">
                {/* Dropdown Header with Category Filter Tabs */}
                <div className="p-2.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1 overflow-x-auto text-xs py-0.5">
                    <button
                      type="button"
                      onClick={() => setSearchTab('all')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                        searchTab === 'all'
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
                          : 'text-gray-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      All ({searchResults.totalCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchTab('projects')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                        searchTab === 'projects'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'text-gray-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Projects ({searchResults.projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchTab('notes')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                        searchTab === 'notes'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-gray-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Free Notes & PYQs ({searchResults.notes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchTab('prep')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                        searchTab === 'prep'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-gray-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Placement E-Books ({searchResults.preps.length})
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Dropdown Scrollable Results / Suggestions (Taller for laptop) */}
                <div className="overflow-y-auto flex-1 p-3 space-y-3 max-h-[380px] custom-scrollbar">
                  {!searchQuery.trim() ? (
                    // Default State: Trending Searches & Quick Navigation
                    <div className="space-y-4 py-1">
                      <div>
                        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
                          <span>Trending Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_SEARCHES.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSearchQuery(tag);
                                searchInputRef.current?.focus();
                              }}
                              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Quick Category Explore</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleItemClick('/projects')}
                            className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors group"
                          >
                            <Code2 className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                            <div className="text-xs font-bold text-white">Projects</div>
                            <div className="text-[10px] text-gray-400">Complete Code + PPT</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleItemClick('/study-materials')}
                            className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors group"
                          >
                            <GraduationCap className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                            <div className="text-xs font-bold text-white">Free Notes & PYQs</div>
                            <div className="text-[10px] text-gray-400">Semester & AKTU guides</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleItemClick('/placement-prep')}
                            className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors group"
                          >
                            <BookOpen className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                            <div className="text-xs font-bold text-white">Placement E-Books</div>
                            <div className="text-[10px] text-gray-400">DSA & Tech Handbooks</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : searchResults.totalCount === 0 ? (
                    // No matches
                    <div className="py-8 text-center space-y-2">
                      <Search className="w-8 h-8 text-gray-500 mx-auto opacity-50" />
                      <div className="text-sm font-semibold text-white">No results found for "{searchQuery}"</div>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto">
                        Try searching with broad terms like "MERN", "Python", "SQL", "Big Data", or university name.
                      </p>
                    </div>
                  ) : (
                    // Results View
                    <div className="space-y-3">
                      {/* Projects List */}
                      {(searchTab === 'all' || searchTab === 'projects') && searchResults.projects.length > 0 && (
                        <div className="space-y-1.5">
                          {searchTab === 'all' && (
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-1 pt-1">
                              <span className="flex items-center gap-1.5">
                                <Code2 className="w-3.5 h-3.5" /> Projects ({searchResults.projects.length})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleItemClick(`/projects?search=${encodeURIComponent(searchQuery)}`)}
                                className="text-gray-400 hover:text-white normal-case font-normal hover:underline"
                              >
                                View all →
                              </button>
                            </div>
                          )}
                          {searchResults.projects.slice(0, searchTab === 'all' ? 4 : 20).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleItemClick(item.url)}
                              className="p-2.5 hover:bg-slate-800/70 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group border border-transparent hover:border-slate-700/70"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                  <Code2 className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-1.5">
                                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${item.badgeStyle}`}>
                                      {item.badge}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-primary-300 transition-colors truncate">
                                      {item.title}
                                    </h4>
                                  </div>
                                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                {item.price && (
                                  <span className="text-xs font-mono font-bold text-gray-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                    {item.price}
                                  </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes List */}
                      {(searchTab === 'all' || searchTab === 'notes') && searchResults.notes.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {searchTab === 'all' && (
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-1 pt-1">
                              <span className="flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5" /> Free Notes & PYQs ({searchResults.notes.length})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleItemClick(`/study-materials?search=${encodeURIComponent(searchQuery)}`)}
                                className="text-gray-400 hover:text-white normal-case font-normal hover:underline"
                              >
                                View all →
                              </button>
                            </div>
                          )}
                          {searchResults.notes.slice(0, searchTab === 'all' ? 4 : 20).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleItemClick(item.url)}
                              className="p-2.5 hover:bg-slate-800/70 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group border border-transparent hover:border-slate-700/70"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                  <GraduationCap className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-1.5">
                                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${item.badgeStyle}`}>
                                      {item.badge}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                                      {item.title}
                                    </h4>
                                  </div>
                                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                                  FREE
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Placement Prep / Ebooks List */}
                      {(searchTab === 'all' || searchTab === 'prep') && searchResults.preps.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {searchTab === 'all' && (
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400 px-1 pt-1">
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" /> Placement E-Books & Roadmaps ({searchResults.preps.length})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleItemClick(`/placement-prep?search=${encodeURIComponent(searchQuery)}`)}
                                className="text-gray-400 hover:text-white normal-case font-normal hover:underline"
                              >
                                View all →
                              </button>
                            </div>
                          )}
                          {searchResults.preps.slice(0, searchTab === 'all' ? 4 : 20).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleItemClick(item.url)}
                              className="p-2.5 hover:bg-slate-800/70 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group border border-transparent hover:border-slate-700/70"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-1.5">
                                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${item.badgeStyle}`}>
                                      {item.badge}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                                      {item.title}
                                    </h4>
                                  </div>
                                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                {item.price && (
                                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                                    {item.price}
                                  </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown Footer with Quick Search Jumps */}
                <div className="p-2.5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                  <span className="truncate text-[11px]">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">Enter</kbd> to search or pick section:
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleItemClick(`/projects?search=${encodeURIComponent(searchQuery)}`)}
                      className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors border border-slate-700/60"
                    >
                      Projects →
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick(`/study-materials?search=${encodeURIComponent(searchQuery)}`)}
                      className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white transition-colors border border-slate-700/60"
                    >
                      Notes →
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick(`/placement-prep?search=${encodeURIComponent(searchQuery)}`)}
                      className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white transition-colors border border-slate-700/60"
                    >
                      E-Books →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium text-gray-300 shrink-0">
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link to="/placement-prep" className="hover:text-white transition-colors">Placement & Roadmaps</Link>
            <Link to="/study-materials" className="hover:text-white transition-colors">Free Notes & PYQs</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center space-x-1.5 bg-accent-600/20 text-accent-400 border border-accent-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-accent-600/30 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard/purchases"
                    className="inline-flex items-center space-x-1.5 bg-surface-hover text-gray-200 border border-border/60 px-3 py-1.5 rounded-lg text-xs font-medium hover:text-white transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-primary-400" />
                    <span>My Purchases</span>
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  className="w-9 h-9 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-300 hover:bg-primary-600/50 transition-colors"
                  title={user?.name}
                >
                  <User className="w-4 h-4" />
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-glow-sm hover:from-primary-500 hover:to-primary-400 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean & Undisturbed) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <input
              type="text"
              placeholder="Search projects, notes, e-books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-400"
            />
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-300">
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">Explore Projects</Link>
            <Link to="/placement-prep" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">Placement & Roadmaps</Link>
            <Link to="/study-materials" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">Free Notes & PYQs</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">About Platform</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">Pricing & Customization</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">FAQ</Link>
            <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">Support & Contact</Link>
          </nav>

          <div className="pt-3 border-t border-border/60 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 text-sm font-medium text-primary-400 py-1">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>User Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 text-sm font-medium text-accent-400 py-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 text-sm text-red-400 py-1">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center text-sm font-medium border border-border rounded-xl py-2 text-gray-200">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center text-sm font-semibold bg-primary-600 rounded-xl py-2 text-white shadow-glow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
