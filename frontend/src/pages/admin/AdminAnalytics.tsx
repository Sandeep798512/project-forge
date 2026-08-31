import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, CheckCircle2, Eye, ShoppingCart, Download, DollarSign } from 'lucide-react';
import api from '../../services/api';

export const AdminAnalytics: React.FC = () => {
  const [funnel, setFunnel] = useState<any>({
    views: 0,
    buyClicks: 0,
    checkouts: 0,
    paymentSuccess: 0,
    downloads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnel();
  }, []);

  const fetchFunnel = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/analytics/funnel');
      if (res.data.success) setFunnel(res.data.funnel);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcRate = (numerator: number, denominator: number) => {
    if (!denominator) return '0.0%';
    return `${((numerator / denominator) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Conversion Funnel & Buyer Journey Analytics</h1>
        <p className="text-gray-400 text-xs mt-1">Real-time user progression from project view to checkout, verified payment, and digital download.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-xs">Computing real funnel data...</div>
      ) : (
        <div className="space-y-6">
          
          {/* Conversion Funnel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            
            <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold">1. Project Views</span>
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-extrabold text-white">{funnel.views}</p>
              <span className="text-[10px] text-gray-400">Catalogue Impressions</span>
            </div>

            <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold">2. Buy Clicks</span>
                <ShoppingCart className="w-4 h-4 text-accent-400" />
              </div>
              <p className="text-2xl font-extrabold text-white">{funnel.buyClicks}</p>
              <span className="text-[10px] text-accent-400 font-bold">
                {calcRate(funnel.buyClicks, funnel.views)} Click Rate
              </span>
            </div>

            <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold">3. Checkout Init</span>
                <TrendingUp className="w-4 h-4 text-primary-400" />
              </div>
              <p className="text-2xl font-extrabold text-white">{funnel.checkouts}</p>
              <span className="text-[10px] text-primary-400 font-bold">
                {calcRate(funnel.checkouts, funnel.buyClicks)} Checkout Intent
              </span>
            </div>

            <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold">4. Paid Orders</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">{funnel.paymentSuccess}</p>
              <span className="text-[10px] text-emerald-400 font-bold">
                {calcRate(funnel.paymentSuccess, funnel.checkouts)} Paid Conversion
              </span>
            </div>

            <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold">5. Downloads</span>
                <Download className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl font-extrabold text-white">{funnel.downloads}</p>
              <span className="text-[10px] text-yellow-400 font-bold">
                {calcRate(funnel.downloads, funnel.paymentSuccess)} Fulfillment
              </span>
            </div>

          </div>

          {/* Visual Bar Progression */}
          <div className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white">Funnel Stage Dropoff Progression</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                  <span>Project Page Impressions</span>
                  <span>100% ({funnel.views})</span>
                </div>
                <div className="w-full bg-background h-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                  <span>Buy Button Clickers</span>
                  <span>{calcRate(funnel.buyClicks, funnel.views)} ({funnel.buyClicks})</span>
                </div>
                <div className="w-full bg-background h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: calcRate(funnel.buyClicks, Math.max(funnel.views, 1)) }}
                    className="bg-accent-500 h-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                  <span>Verified Successful Payments</span>
                  <span>{calcRate(funnel.paymentSuccess, funnel.views)} ({funnel.paymentSuccess})</span>
                </div>
                <div className="w-full bg-background h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: calcRate(funnel.paymentSuccess, Math.max(funnel.views, 1)) }}
                    className="bg-emerald-500 h-full"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
