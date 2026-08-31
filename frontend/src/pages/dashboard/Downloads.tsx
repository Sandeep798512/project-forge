import React, { useState, useEffect } from 'react';
import { Download, ShieldCheck, Clock, Monitor } from 'lucide-react';
import api from '../../services/api';

export const Downloads: React.FC = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/me/downloads');
        if (res.data.success) {
          setDownloads(res.data.downloads);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Download Access Logs</h1>
        <p className="text-gray-400 text-xs mt-1">Audit log of your authenticated source code package downloads.</p>
      </div>

      <div className="bg-surface/80 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading logs...</div>
        ) : downloads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-4">Project Package</th>
                  <th className="p-4">Version</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {downloads.map((d) => (
                  <tr key={d._id} className="hover:bg-surface-hover">
                    <td className="p-4 font-bold flex items-center space-x-2">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>{d.product?.title || 'Software Project Zip'}</span>
                    </td>
                    <td className="p-4 font-mono text-primary-400">v{d.versionDownloaded || '1.0.0'}</td>
                    <td className="p-4 font-mono text-gray-400">{d.ipAddress}</td>
                    <td className="p-4 text-gray-400">{new Date(d.downloadedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-xs">
            No file downloads recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
