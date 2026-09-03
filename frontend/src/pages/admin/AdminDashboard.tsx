import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Package,
  Download,
  RotateCcw,
  TrendingUp,
  Star,
  Search,
  X,
  Tag,
} from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter state for Recent Customer Orders (Order ID, Customer Name, Coupon Code)
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/analytics/overview');
      if (res.data.success) {
        setSummary(res.data.summary);
        setRecentOrders(res.data.recentOrders || []);
        setTopProducts(res.data.topProducts || []);
        setRecentCustomers(res.data.recentCustomers || []);
        setRevenueChart(res.data.revenueChart || []);
      }
    } catch (err) {
      console.error('Failed to load real dashboard analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecentOrders = recentOrders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const query = orderSearch.toLowerCase().trim();
    const matchId = o.orderId ? o.orderId.toLowerCase().includes(query) : false;
    const matchName = o.user?.name ? o.user.name.toLowerCase().includes(query) : false;
    const matchEmail = o.user?.email ? o.user.email.toLowerCase().includes(query) : false;
    const matchCoupon = o.couponCode ? o.couponCode.toLowerCase().includes(query) : false;
    return matchId || matchName || matchEmail || matchCoupon;
  });

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-400 text-xs font-mono">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-500 mx-auto mb-3" />
        Fetching real-time business statistics from MongoDB...
      </div>
    );
  }

  const maxRevenue = Math.max(...(revenueChart.map((d) => d.revenue) || [1]), 1000);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Business Overview & Sales Analytics</h1>
        <p className="text-gray-400 text-xs mt-1">Real-time revenue, order conversions, customer acquisition, and marketplace product rankings.</p>
      </div>

      {/* 11 Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Today's Revenue</span>
          <p className="text-xl font-extrabold text-emerald-400">
            {BRAND.currency.symbol}{(summary?.todayRevenue || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500">Since 00:00 IST</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Monthly Revenue</span>
          <p className="text-xl font-extrabold text-white">
            {BRAND.currency.symbol}{(summary?.monthlyRevenue || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500">Current Month</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Total Revenue</span>
          <p className="text-xl font-extrabold text-white">
            {BRAND.currency.symbol}{(summary?.totalRevenue || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">Verified Sales</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Total Orders</span>
          <p className="text-xl font-extrabold text-white">{summary?.totalOrders || 0}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">{summary?.successfulOrders || 0} Paid</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Failed Payments</span>
          <p className="text-xl font-extrabold text-red-400">{summary?.failedPayments || 0}</p>
          <span className="text-[10px] text-gray-500">Gateway Failures</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Pending Orders</span>
          <p className="text-xl font-extrabold text-yellow-400">{summary?.pendingPayments || 0}</p>
          <span className="text-[10px] text-gray-500">Awaiting Signature</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Total Customers</span>
          <p className="text-xl font-extrabold text-white">{summary?.totalCustomers || 0}</p>
          <span className="text-[10px] text-gray-500">Registered Users</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Active Products</span>
          <p className="text-xl font-extrabold text-white">{summary?.totalProducts || 0}</p>
          <span className="text-[10px] text-gray-500">Catalog Packages</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Total Downloads</span>
          <p className="text-xl font-extrabold text-white">{summary?.totalDownloads || 0}</p>
          <span className="text-[10px] text-gray-500">File Packages</span>
        </div>

        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-gray-400 font-semibold block">Refunds</span>
          <p className="text-xl font-extrabold text-gray-300">{summary?.refunds || 0}</p>
          <span className="text-[10px] text-gray-500">Refunded Orders</span>
        </div>

      </div>

      {/* Revenue Chart Section */}
      <div className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Daily Revenue Trend</h3>
            <p className="text-xs text-gray-400">Aggregated verified sales by date from MongoDB Order collection.</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            REAL DB DATA
          </span>
        </div>

        {revenueChart.length > 0 ? (
          <div className="h-44 flex items-end justify-between space-x-2 pt-6 pb-2 border-b border-border/60 overflow-x-auto">
            {revenueChart.map((d, idx) => {
              const heightPercent = Math.max(10, Math.round((d.revenue / maxRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group min-w-[28px]">
                  <div className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    ₹{d.revenue}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-primary-600 to-accent-500 rounded-t group-hover:brightness-125 transition-all"
                  />
                  <span className="text-[9px] font-mono text-gray-500 mt-2 rotate-45 sm:rotate-0">
                    {d._id.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-xs border border-dashed border-border rounded-xl">
            No paid order transactions recorded yet. Data will populate automatically upon checkout.
          </div>
        )}
      </div>

      {/* Grid: Recent Orders (2/3) + Top Products & Customers (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table with Search */}
        <div className="lg:col-span-2 bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white">Recent Customer Orders</h3>
              <p className="text-[11px] text-gray-400">Search by Order ID, Customer Name/Email, or Coupon Code</p>
            </div>

            {/* Order ID, Customer Name, and Coupon Code Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Order ID, Customer, or Coupon (e.g. SAN2020)..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors font-mono"
              />
              {orderSearch && (
                <button
                  onClick={() => setOrderSearch('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {filteredRecentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Coupon Used</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-gray-200">
                  {filteredRecentOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-surface-hover">
                      <td className="p-3 font-mono font-bold text-primary-400">{o.orderId}</td>
                      <td className="p-3 font-semibold">{o.user?.name || o.user?.email || 'Customer'}</td>
                      <td className="p-3 font-mono">
                        {o.couponCode ? (
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-accent-500/15 text-accent-300 border border-accent-500/30 flex items-center space-x-1 w-max">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{o.couponCode}</span>
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="p-3 font-bold">{BRAND.currency.symbol}{o.finalAmount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          o.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-xs">
              {orderSearch ? `No orders found matching "${orderSearch}"` : 'No orders recorded in database.'}
            </div>
          )}
        </div>

        {/* Right Column: Top Products & Customers */}
        <div className="space-y-6">
          
          {/* Top Products Card */}
          <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-white">Top Purchased Products</h4>
            <div className="space-y-2.5">
              {topProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-xs p-2.5 bg-background border border-border/60 rounded-xl">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <img src={p.thumbnail} alt={p.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="overflow-hidden">
                      <h5 className="font-bold text-white truncate">{p.title}</h5>
                      <span className="text-[10px] text-gray-400">{p.downloadCount || 0} Downloads</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 flex-shrink-0 ml-2">
                    {BRAND.currency.symbol}{p.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Customers Card */}
          <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-white">Recent Customer Registrations</h4>
            <div className="space-y-2">
              {recentCustomers.map((c) => (
                <div key={c._id} className="flex items-center justify-between text-xs p-2.5 bg-background border border-border/60 rounded-xl">
                  <div>
                    <h5 className="font-bold text-white">{c.name}</h5>
                    <p className="text-[10px] text-gray-400">{c.email}</p>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
