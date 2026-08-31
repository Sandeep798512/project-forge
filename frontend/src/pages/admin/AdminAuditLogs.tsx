import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import api from '../../services/api';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        if (res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Security Audit Logs</h1>
        <p className="text-gray-400 text-xs mt-1">Immutable security event tracking and file access logs.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Action Event</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {logs.map((l) => (
                  <tr key={l._id} className="hover:bg-surface-hover font-mono">
                    <td className="p-3.5 font-bold text-accent-400">{l.action}</td>
                    <td className="p-3.5 text-gray-300">{l.user?.name || l.user?.email || 'System'}</td>
                    <td className="p-3.5 text-gray-400">{l.ipAddress || '127.0.0.1'}</td>
                    <td className="p-3.5 text-gray-400">{new Date(l.createdAt).toLocaleString()}</td>
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
