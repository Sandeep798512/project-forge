import React, { useState, useEffect } from 'react';
import { Tag, Plus, Save } from 'lucide-react';
import api from '../../services/api';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(20);
  const [minOrderAmount, setMinOrderAmount] = useState(500);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/coupons');
      if (res.data.success) setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/coupons', {
        code: code.toUpperCase(),
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount),
      });
      if (res.data.success) {
        setCode('');
        fetchCoupons();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Coupon Code Management</h1>
        <p className="text-gray-400 text-xs mt-1">Create promotional discount coupons for checkout validation.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-white">Create New Coupon</h3>
        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="FORGE20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Value</label>
            <input
              type="number"
              required
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Min Order (₹)</label>
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coupon</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading coupons...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Discount</th>
                <th className="p-3.5">Min Order</th>
                <th className="p-3.5">Times Used</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-gray-200">
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td className="p-3.5 font-mono font-bold text-primary-400">{c.code}</td>
                  <td className="p-3.5 font-bold">{c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}</td>
                  <td className="p-3.5 font-mono">₹{c.minOrderAmount}</td>
                  <td className="p-3.5 font-mono">{c.timesUsed}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${c.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
