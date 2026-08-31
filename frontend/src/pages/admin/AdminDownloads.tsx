import React, { useState, useEffect } from 'react';
import { Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export const AdminDownloads: React.FC = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [abuseCount, setAbuseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/downloads/activity');
      if (res.data.success) {
        setDownloads(res.data.downloads);
        setAbuseCount(res.data.abuseFlaggedCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Download Activity & Abuse Detection</h1>
          <p className="text-gray-400 text-xs mt-1">Audit signed URL file requests and detect abnormal download attempts.</p>
        </div>

        {abuseCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{abuseCount} User(s) Flagged for High Frequency Downloads</span>
          </div>
        )}
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading download activity...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Downloaded Product</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5">File Version</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200 font-mono">
                {downloads.map((d) => (
                  <tr key={d._id} className="hover:bg-surface-hover">
                    <td className="p-3.5 font-bold text-white">{d.user?.name || d.user?.email || 'User'}</td>
                    <td className="p-3.5 text-accent-400">{d.product?.title || 'Package ZIP'}</td>
                    <td className="p-3.5 text-gray-400">{d.ipAddress || '127.0.0.1'}</td>
                    <td className="p-3.5 text-primary-400">v{d.versionDownloaded || '1.0.0'}</td>
                    <td className="p-3.5 text-gray-400">{new Date(d.downloadedAt).toLocaleString()}</td>
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
