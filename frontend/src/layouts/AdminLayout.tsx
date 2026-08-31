import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Package, ShoppingCart, Tag, FileText, ArrowLeft, Terminal } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gray-400 text-xs">Checking admin credentials...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const adminNav = [
    { label: 'Overview Metrics', path: '/admin', icon: LayoutDashboard },
    { label: 'Product Manager', path: '/admin/products', icon: Package },
    { label: 'Orders & Payments', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Coupon Manager', path: '/admin/coupons', icon: Tag },
    { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border p-5 space-y-6 flex-shrink-0">
        <div className="flex items-center space-x-3 pb-4 border-b border-border/60">
          <div className="w-9 h-9 rounded-xl bg-accent-600/20 border border-accent-500/40 flex items-center justify-center text-accent-400 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white">{BRAND.name}</span>
            <span className="block text-[10px] uppercase font-mono text-accent-400 font-semibold">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-surface-hover'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border/60">
          <Link to="/dashboard" className="text-xs text-gray-400 hover:text-white flex items-center space-x-1.5 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
