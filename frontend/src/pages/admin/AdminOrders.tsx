import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, X, Tag } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter state for Orders page (Order ID, Customer, Coupon)
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/admin/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const query = orderSearch.toLowerCase().trim();
    const matchId = o.orderId ? o.orderId.toLowerCase().includes(query) : false;
    const matchName = o.user?.name ? o.user.name.toLowerCase().includes(query) : false;
    const matchEmail = o.user?.email ? o.user.email.toLowerCase().includes(query) : false;
    const matchCoupon = o.couponCode ? o.couponCode.toLowerCase().includes(query) : false;
    return matchId || matchName || matchEmail || matchCoupon;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Orders & Payment Monitoring</h1>
          <p className="text-gray-400 text-xs mt-1">Audit transactions, coupon usages, and verified payments across the marketplace.</p>
        </div>

        {/* Order ID, Customer Name, and Coupon Code Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, or Coupon (e.g. SAN2020)..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full bg-surface border border-border/80 rounded-xl pl-9 pr-8 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 font-mono"
          />
          {orderSearch && (
            <button
              onClick={() => setOrderSearch('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Coupon Used</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-surface-hover">
                      <td className="p-3.5 font-mono font-bold text-primary-400">{o.orderId}</td>
                      <td className="p-3.5 font-semibold">{o.user?.name || o.user?.email || 'User'}</td>
                      <td className="p-3.5 font-bold text-white">{BRAND.currency.symbol}{o.finalAmount}</td>
                      <td className="p-3.5 font-mono">
                        {o.couponCode ? (
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-accent-500/15 text-accent-300 border border-accent-500/30 flex items-center space-x-1 w-max">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{o.couponCode}</span>
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                          o.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-400">{new Date(o.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 text-xs">
                      {orderSearch ? `No orders found matching "${orderSearch}"` : 'No orders recorded.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
