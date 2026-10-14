import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  CreditCard,
  Users,
  KeyRound,
  Download,
  Tag,
  Star,
  Headphones,
  TrendingUp,
  FileText,
  Settings,
  Shield,
  ArrowLeft,
  Terminal,
  Menu,
  X,
  Sparkles,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-gray-400 text-xs font-mono">
        Verifying admin session & RBAC permissions...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const adminNav = [
    { label: '1. Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: '2. Products', path: '/admin/products', icon: Package },
    { label: '3. Versions', path: '/admin/product-versions', icon: Sparkles },
    { label: '4. Categories', path: '/admin/categories', icon: Layers },
    { label: '5. Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: '6. Payments', path: '/admin/payments', icon: CreditCard },
    { label: '7. Customers', path: '/admin/customers', icon: Users },
    { label: '8. Entitlements', path: '/admin/entitlements', icon: KeyRound },
    { label: '9. Downloads', path: '/admin/downloads', icon: Download },
    { label: '10. Coupons', path: '/admin/coupons', icon: Tag },
    { label: '11. Reviews', path: '/admin/reviews', icon: Star },
    { label: '12. Support', path: '/admin/support', icon: Headphones },
    { label: '13. Analytics', path: '/admin/analytics', icon: TrendingUp },
    { label: '14. Content (CMS)', path: '/admin/content', icon: FileText },
    { label: '15. Settings', path: '/admin/settings', icon: Settings },
    { label: '16. Audit Logs', path: '/admin/audit-logs', icon: Shield },
    { label: '17. Study Materials', path: '/admin/study-materials', icon: BookOpen },
    { label: '18. Placement & Roadmaps', path: '/admin/placement-prep', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      
      {/* Desktop Sidebar (16 Modules) */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-border p-5 justify-between flex-shrink-0">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-border/60">
            <img
              src="/campusget-icon-light-tile.png"
              alt={BRAND.name}
              className="w-10 h-10 rounded-xl object-contain shadow-glow-sm"
            />
            <div className="overflow-hidden">
              <span className="font-extrabold text-base text-white truncate block">{BRAND.name}</span>
              <span className="inline-block text-[10px] font-mono font-bold bg-accent-500/10 text-accent-400 border border-accent-500/30 px-2 py-0.5 rounded uppercase">
                {user?.role === 'admin' ? 'SUPER ADMIN' : 'ADMIN ROLE'}
              </span>
            </div>
          </div>

          {/* 16 Section Nav */}
          <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-none">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-600/20 text-accent-300 border border-accent-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-surface-hover'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
          <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center space-x-1.5 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bar */}
      <div className="lg:hidden bg-surface border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-accent-400" />
          <span className="font-bold text-white text-base">{BRAND.name} Business Suite</span>
        </div>
        <button onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)} className="text-gray-300">
          {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden bg-surface border-b border-border p-4 space-y-2 max-h-[75vh] overflow-y-auto">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center space-x-3 py-2 text-xs text-gray-200 font-semibold"
            >
              <item.icon className="w-4 h-4 text-accent-400" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
};
