import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminCustomers: React.FC = () => {
  const getInitialCustomers = () => {
    try {
      const cached = localStorage.getItem('cg_admin_customers_cache') || sessionStorage.getItem('cg_admin_customers_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  };

  const initialCusts = getInitialCustomers();
  const [customers, setCustomers] = useState<any[]>(initialCusts);
  const [loading, setLoading] = useState(initialCusts.length === 0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      if (customers.length === 0) setLoading(true);
      const res = await api.get(`/admin/customers/list?search=${search}`);
      if (res.data.success && Array.isArray(res.data.customers)) {
        setCustomers(res.data.customers);
        if (!search) {
          sessionStorage.setItem('cg_admin_customers_cache', JSON.stringify(res.data.customers));
          localStorage.setItem('cg_admin_customers_cache', JSON.stringify(res.data.customers));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (id: string) => {
    try {
      const res = await api.post(`/admin/customers/${id}/toggle-suspend`);
      if (res.data.success) {
        fetchCustomers();
      }
    } catch (err) {
      alert('Failed to update customer suspension status');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Customer Account Management</h1>
        <p className="text-gray-400 text-xs mt-1">Manage registered developers, view lifetime spending, and toggle account suspension status.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-gray-100"
          />
        </div>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden relative">
        {loading && customers.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
            <span>Loading customers...</span>
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Purchases</th>
                  <th className="p-3.5">Total Spent</th>
                  <th className="p-3.5">Account Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-surface-hover">
                    <td className="p-3.5 font-bold text-white">{c.name}</td>
                    <td className="p-3.5 font-mono text-gray-300">{c.email}</td>
                    <td className="p-3.5 font-mono">{c.purchaseCount || 0} Products</td>
                    <td className="p-3.5 font-bold text-emerald-400">{BRAND.currency.symbol}{c.totalSpent || 0}</td>
                    <td className="p-3.5">
                      {c.isSuspended ? (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          SUSPENDED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleSuspend(c._id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[10px] ${
                          c.isSuspended ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {c.isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
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
