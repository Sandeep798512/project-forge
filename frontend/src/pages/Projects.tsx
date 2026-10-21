import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { ProjectCard } from '../components/marketplace/ProjectCard';
import { CategoryFilter, CategoryItem } from '../components/marketplace/CategoryFilter';
import { ScrollReveal, ScrollStagger } from '../components/common/ScrollReveal';
import { INITIAL_CATEGORIES, INITIAL_FEATURED_PRODUCTS } from '../data/initialMarketplaceData';
import api from '../services/api';

export const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Instant synchronous cache helpers for 0ms initial render
  const getInitialCatalog = () => {
    try {
      const cachedCatalog = localStorage.getItem('cg_cached_catalog');
      if (cachedCatalog) {
        const parsed = JSON.parse(cachedCatalog);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p: any) => p.productType !== 'placement_prep');
        }
      }
      const cachedFeatured = localStorage.getItem('cg_cached_featured');
      if (cachedFeatured) {
        const parsed = JSON.parse(cachedFeatured);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p: any) => p.productType !== 'placement_prep');
        }
      }
    } catch (e) {}
    return INITIAL_FEATURED_PRODUCTS;
  };

  const getInitialCategories = () => {
    try {
      const cached = localStorage.getItem('cg_cached_categories');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CATEGORIES;
  };

  const [products, setProducts] = useState<any[]>(getInitialCatalog);
  const [categories, setCategories] = useState<CategoryItem[]>(getInitialCategories);
  const [loading, setLoading] = useState<boolean>(() => {
    const hasCached = getInitialCatalog().length > 0;
    const isDefault = !searchParams.get('search') && !searchParams.get('category') && !searchParams.get('difficulty');
    return !hasCached || !isDefault;
  });

  // Filters state
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState<string>(searchParams.get('difficulty') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'createdAt');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
          localStorage.setItem('cg_cached_categories', JSON.stringify(res.data.categories));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const isDefaultFilter = !search && !category && !difficulty && sort === 'createdAt' && page === 1;

    const fetchProducts = async () => {
      try {
        // Show loading skeleton only when we have no items yet or when applying filters
        if (!isDefaultFilter && products.length === 0) {
          setLoading(true);
        }
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (difficulty) params.set('difficulty', difficulty);
        if (sort) params.set('sort', sort);
        params.set('page', page.toString());
        params.set('limit', '9');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          const projectOnly = (res.data.products || []).filter((p: any) => p.productType !== 'placement_prep');
          setProducts(projectOnly);
          setTotalPages(res.data.pagination?.pages || 1);
          if (isDefaultFilter) {
            localStorage.setItem('cg_cached_catalog', JSON.stringify(projectOnly));
          }
        }
      } catch (err) {
        console.error('Error fetching products catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, difficulty, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setSort('createdAt');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <ScrollReveal animation="fade-up" className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Software Project Marketplace
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Browse production-ready full-stack software packages with complete source code & documentation.
          </p>
        </ScrollReveal>

        {/* Search & Main Controls Bar */}
        <ScrollReveal animation="fade-up" delay={80} className="bg-surface/80 border border-border/80 rounded-2xl p-4 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, tech stack (React, Python, Gemini)..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              className="bg-background border border-border/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Sort Order */}
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-background border border-border/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="createdAt">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            {/* Reset Button */}
            {(search || category || difficulty || sort !== 'createdAt') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-1.5 text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-2 border border-red-500/20 rounded-xl bg-red-500/10 transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <CategoryFilter
                categories={categories}
                selectedCategory={category}
                onSelectCategory={(slug) => { setCategory(slug); setPage(1); }}
              />
            </div>
          )}
        </ScrollReveal>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-surface/50 rounded-2xl animate-pulse border border-border/40" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <ScrollStagger
              staggerDelay={70}
              animation="fade-up"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            >
              {products.map((product) => (
                <ProjectCard key={product._id} product={product} />
              ))}
            </ScrollStagger>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-gray-300 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-400 px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-gray-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-surface/40 rounded-2xl border border-border/60">
            <SlidersHorizontal className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No projects found</h3>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your search keywords or category filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl shadow-glow-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
