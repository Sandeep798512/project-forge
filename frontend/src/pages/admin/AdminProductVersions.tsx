import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, CheckCircle2, FileText, Calendar } from 'lucide-react';
import api from '../../services/api';

export const AdminProductVersions: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [versionNumber, setVersionNumber] = useState('v1.1.0');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [fileKey, setFileKey] = useState('packages/sample-project.zip');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/products/enhanced?limit=50');
      if (res.data.success && res.data.products.length > 0) {
        setProducts(res.data.products);
        setSelectedProductId(res.data.products[0]._id);
        fetchVersions(res.data.products[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async (pId: string) => {
    try {
      const res = await api.get(`/admin/products/${pId}/versions`);
      if (res.data.success) {
        setVersions(res.data.versions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      const res = await api.post(`/admin/products/${selectedProductId}/versions`, {
        versionNumber,
        releaseNotes,
        fileKey,
        isAvailableToExistingCustomers: true,
      });

      if (res.data.success) {
        setReleaseNotes('');
        fetchVersions(selectedProductId);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating version');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Product Release & Version Control</h1>
        <p className="text-gray-400 text-xs mt-1">Publish new version releases (e.g. v1.1.0, v2.0.0) with release notes for existing customers.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
        <label className="block font-semibold text-xs text-gray-300">Select Target Product Package</label>
        <select
          value={selectedProductId}
          onChange={(e) => {
            setSelectedProductId(e.target.value);
            fetchVersions(e.target.value);
          }}
          className="w-full sm:w-96 bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-gray-100 font-semibold"
        >
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title} (Current: v{p.currentVersion || '1.0.0'})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Release Form (1/3) */}
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>Publish New Version</span>
          </h3>

          <form onSubmit={handleCreateVersion} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-300 mb-1">Version Number</label>
              <input
                type="text"
                required
                placeholder="v1.1.0"
                value={versionNumber}
                onChange={(e) => setVersionNumber(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Package Storage Key</label>
              <input
                type="text"
                required
                value={fileKey}
                onChange={(e) => setFileKey(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Release Notes</label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Added JWT refresh token flow, fixed MongoDB index warning..."
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold flex items-center justify-center space-x-1.5 shadow-glow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Release Version</span>
            </button>
          </form>
        </div>

        {/* Versions Log (2/3) */}
        <div className="md:col-span-2 bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Version History & Release Log</h3>

          {versions.length > 0 ? (
            <div className="space-y-3">
              {versions.map((v) => (
                <div key={v._id} className="p-4 rounded-xl bg-background border border-border/60 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-accent-400 text-sm">{v.versionNumber}</span>
                    <span className="text-[10px] text-gray-400 flex items-center space-x-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(v.releasedAt).toLocaleString()}</span>
                    </span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-line font-mono leading-relaxed">{v.releaseNotes}</p>
                  <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-gray-500">
                    Package Key: {v.fileKey}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 text-xs">No extra versions released for this product yet.</div>
          )}
        </div>

      </div>
    </div>
  );
};
