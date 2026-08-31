import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminPayments: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders/list');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Payment Gateway Ledger & Audit</h1>
        <p className="text-gray-400 text-xs mt-1">Immutable payment provider transactions, webhook logs, and verification statuses.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading payment transactions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Gateway Payment ID</th>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-surface-hover">
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">
                      {o.razorpayPaymentId || `pay_sim_${o.orderId?.slice(-8)}`}
                    </td>
                    <td className="p-3.5 font-mono text-primary-400">{o.orderId}</td>
                    <td className="p-3.5 font-semibold">{o.user?.name || o.user?.email || 'Customer'}</td>
                    <td className="p-3.5 font-bold text-white">{BRAND.currency.symbol}{o.finalAmount}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        o.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-400 font-mono">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
