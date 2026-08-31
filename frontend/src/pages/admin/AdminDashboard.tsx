import React, { useState, useEffect } from 'react';
import { IndianRupee, ShoppingCart, Users, Package, Download, TrendingUp } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/metrics');
        if (res.data.success) {
          setMetrics(res.data.metrics);
          setRecentOrders(res.data.recentOrders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="text-gray-400 text-xs py-10">Loading admin metrics...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Revenue & Performance Metrics</h1>
        <p className="text-gray-400 text-xs mt-1">Real-time marketplace analytics and operational statistics.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Revenue</span>
            <IndianRupee className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {BRAND.currency.symbol}{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Verified Server Payments</span>
          </span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Orders</span>
            <ShoppingCart className="w-5 h-5 text-primary-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{metrics?.totalOrders || 0}</p>
          <span className="text-[11px] text-gray-400">
            {metrics?.paidOrders || 0} Successful Paid
          </span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Registered Customers</span>
            <Users className="w-5 h-5 text-accent-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{metrics?.totalCustomers || 0}</p>
          <span className="text-[11px] text-gray-400">Verified Developers</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Conversion Rate</span>
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{metrics?.conversionRate || 0}%</p>
          <span className="text-[11px] text-gray-400">Checkout to Paid</span>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Recent Customer Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-gray-200">
              {recentOrders.map((o) => (
                <tr key={o._id} className="hover:bg-surface-hover">
                  <td className="p-3 font-mono font-bold text-primary-400">{o.orderId}</td>
                  <td className="p-3 font-semibold">{o.user?.name || o.user?.email || 'Customer'}</td>
                  <td className="p-3 font-bold">{BRAND.currency.symbol}{o.finalAmount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                      o.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
