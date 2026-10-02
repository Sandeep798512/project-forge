import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Download, Headphones, User, Shield, LogOut, Terminal, Menu, X, ArrowLeft } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Purchases', path: '/dashboard/purchases', icon: ShoppingBag },
    { label: 'Downloads', path: '/dashboard/downloads', icon: Download },
    { label: 'Support Tickets', path: '/dashboard/support', icon: Headphones },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Security', path: '/dashboard/security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border p-5 justify-between flex-shrink-0">
        <div className="space-y-6">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/campusget-icon-light-tile.png"
              alt={BRAND.name}
              className="w-9 h-9 rounded-xl object-contain"
            />
            <div>
              <span className="font-extrabold text-lg text-white">{BRAND.name}</span>
              <span className="block text-[10px] uppercase font-mono text-primary-400 font-semibold">User Portal</span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-surface-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info Footer in Sidebar */}
        <div className="pt-4 border-t border-border/60 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-300 font-bold text-xs">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link to="/" className="text-[11px] text-gray-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </Link>
            <button
              onClick={logout}
              className="text-[11px] text-red-400 hover:underline flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-surface border-b border-border p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-primary-400" />
          <span className="font-bold text-white text-base">{BRAND.name}</span>
        </Link>
        <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="text-gray-300">
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-surface border-b border-border p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center space-x-3 py-2 text-sm text-gray-200 font-semibold"
            >
              <item.icon className="w-4 h-4 text-primary-400" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button onClick={() => { logout(); setMobileSidebarOpen(false); }} className="flex items-center space-x-3 py-2 text-sm text-red-400">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
