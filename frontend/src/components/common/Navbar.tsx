import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Search, User, LogOut, LayoutDashboard, ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-primary-400">
                {BRAND.name}
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-mono tracking-widest text-primary-400 font-semibold">
                PRO MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search MERN, AI Resume, Hospital Mgmt, Python..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface/80 border border-border/60 rounded-xl pl-9 pr-4 py-1.5 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-300">
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link to="/study-materials" className="hover:text-emerald-300 text-emerald-400 font-semibold transition-colors flex items-center space-x-1">
              <span>Free Notes & PYQs</span>
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center space-x-3">
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
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-400"
            />
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-300">
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white">Explore Projects</Link>
            <Link to="/study-materials" onClick={() => setMobileMenuOpen(false)} className="py-2 text-emerald-400 font-semibold hover:text-emerald-300">📚 Free Notes & PYQs</Link>
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
