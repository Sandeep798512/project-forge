import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, RotateCcw, Edit3, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const AdminEntitlements: React.FC = () => {
  const [entitlements, setEntitlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setStatusMsg(null);
        const res = await api.post(`/admin/entitlements/${id}/toggle-revoke`);
        if (res.data.success) {
          setStatusMsg({ type: 'success', text: 'Entitlement status updated successfully!' });
          fetchEntitlements();
        }
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update entitlement status.' });
      }
    }
  };

  const handleResetDownloadCount = async (id: string) => {
    if (window.confirm('Reset download usage count to 0 for this customer?')) {
      try {
        setStatusMsg(null);
        const res = await api.post(`/admin/entitlements/${id}/update-limit`, { action: 'reset' });
        if (res.data.success) {
          setStatusMsg({ type: 'success', text: 'Download count reset to 0/5 successfully!' });
          fetchEntitlements();
        }
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reset download count.' });
      }
    }
  };

  const handleSetCustomLimit = async (id: string, currentLimit: number) => {
    const newLimitStr = window.prompt('Set custom maximum download limit for this customer entitlement:', String(currentLimit || 5));
    if (newLimitStr !== null && newLimitStr.trim() !== '') {
      const newLimit = parseInt(newLimitStr.trim(), 10);
      if (!isNaN(newLimit) && newLimit >= 0) {
        try {
          setStatusMsg(null);
          const res = await api.post(`/admin/entitlements/${id}/update-limit`, {
            action: 'set_limit',
            customMaxDownloads: newLimit,
          });
          if (res.data.success) {
            setStatusMsg({ type: 'success', text: `Maximum download limit set to ${newLimit} successfully!` });
            fetchEntitlements();
          }
        } catch (err: any) {
          setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update custom download limit.' });
        }
      } else {
        alert('Please enter a valid positive number for the download limit.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Entitlement Administration</h1>
          <p className="text-gray-400 text-xs mt-1">Manage verified access rights, default 5-download limits, and entitlement revocation.</p>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

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
                  <th className="p-3.5">Download Usage</th>
                  <th className="p-3.5">Access Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {entitlements.map((e) => {
                  const used = e.downloadCount || 0;
                  const max = e.maxDownloads || 5;
                  const isLimitReached = used >= max;

                  return (
                    <tr key={e._id} className="hover:bg-surface-hover">
                      <td className="p-3.5 font-bold text-white">{e.user?.name || e.user?.email || 'User'}</td>
                      <td className="p-3.5 font-semibold text-accent-400">{e.product?.title || 'Product'}</td>
                      <td className="p-3.5 font-mono text-primary-400">{e.order?.orderId || '-'}</td>
                      
                      {/* Download Usage Column */}
                      <td className="p-3.5 font-mono">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            isLimitReached ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {used} / {max} Used
                          </span>
                          <button
                            onClick={() => handleResetDownloadCount(e._id)}
                            className="p-1 text-gray-400 hover:text-accent-400 transition-colors"
                            title="Reset Count to 0"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSetCustomLimit(e._id, max)}
                            className="p-1 text-gray-400 hover:text-primary-400 transition-colors"
                            title="Edit Custom Limit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

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
                      
                      <td className="p-3.5 text-right space-x-2">
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
