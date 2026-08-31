import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Download, Headphones, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await api.get('/me/purchases');
        if (res.data.success) {
          setPurchases(res.data.purchases);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-surface via-surface-hover to-surface border border-border/80 rounded-2xl p-6 sm:p-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Access your purchased software project packages, download source code zips, and access technical support.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-surface/80 border border-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Purchases</span>
            <ShoppingBag className="w-5 h-5 text-primary-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{purchases.length}</p>
          <p className="text-[11px] text-gray-500">Active project packages</p>
        </div>

        <div className="bg-surface/80 border border-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Download Access</span>
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {purchases.length > 0 ? 'Unlocked' : '0'}
          </p>
          <p className="text-[11px] text-gray-500">Authenticated signed URLs</p>
        </div>

        <div className="bg-surface/80 border border-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Developer Support</span>
            <Headphones className="w-5 h-5 text-accent-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">Active</p>
          <p className="text-[11px] text-gray-500">WhatsApp & Tickets enabled</p>
        </div>

      </div>

      {/* Recent Purchases Quick List */}
      <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Purchases</h2>
          <Link to="/dashboard/purchases" className="text-xs font-semibold text-primary-400 hover:underline flex items-center space-x-1">
            <span>View All Purchases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-20 bg-surface animate-pulse rounded-xl" />
        ) : purchases.length > 0 ? (
          <div className="space-y-3">
            {purchases.slice(0, 3).map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-background border border-border/60 rounded-xl text-xs sm:text-sm">
                <div className="flex items-center space-x-3">
                  <img src={item.product?.thumbnail} alt={item.product?.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-white">{item.product?.title}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">Purchased on {new Date(item.grantedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard/purchases"
                  className="px-3 py-1.5 rounded-lg bg-primary-600/20 text-primary-300 font-semibold border border-primary-500/30 hover:bg-primary-600 hover:text-white transition-all text-xs"
                >
                  Access Project
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-xs">
            <p>You haven't purchased any software project packages yet.</p>
            <Link to="/projects" className="mt-2 inline-block font-semibold text-primary-400 hover:underline">
              Explore Available Projects
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};
