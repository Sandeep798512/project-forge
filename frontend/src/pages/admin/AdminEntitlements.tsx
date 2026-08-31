import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export const AdminEntitlements: React.FC = () => {
  const [entitlements, setEntitlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntitlements();
  }, []);

  const fetchEntitlements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/entitlements/list');
      if (res.data.success) setEntitlements(res.data.entitlements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRevoke = async (id: string) => {
    if (window.confirm('Are you sure you want to change access entitlement status for this customer?')) {
      try {
        const res = await api.post(`/admin/entitlements/${id}/toggle-revoke`);
        if (res.data.success) fetchEntitlements();
      } catch (err) {
        alert('Failed to update entitlement');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Product Entitlement Administration</h1>
        <p className="text-gray-400 text-xs mt-1">Manage verified access rights, download permissions, and entitlement revocation.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading entitlements...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Purchased Product</th>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Granted Date</th>
                  <th className="p-3.5">Access Rights</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {entitlements.map((e) => (
                  <tr key={e._id} className="hover:bg-surface-hover">
                    <td className="p-3.5 font-bold text-white">{e.user?.name || e.user?.email || 'User'}</td>
                    <td className="p-3.5 font-semibold text-accent-400">{e.product?.title || 'Product'}</td>
                    <td className="p-3.5 font-mono text-primary-400">{e.order?.orderId || '-'}</td>
                    <td className="p-3.5 text-gray-400">{new Date(e.grantedAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      {e.isRevoked ? (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          REVOKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                          ACTIVE GRANTED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleRevoke(e._id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[10px] ${
                          e.isRevoked ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {e.isRevoked ? 'Restore Access' : 'Revoke Rights'}
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
