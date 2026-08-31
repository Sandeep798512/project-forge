import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Wrench, MessageSquare, ExternalLink, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import api from '../../services/api';

export const MyPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await api.get('/me/purchases');
        if (res.data.success) {
          setPurchases(res.data.purchases);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleDownload = async (productId: string, productTitle: string) => {
    try {
      setDownloadingId(productId);
      setDownloadError(null);

      // Request secure signed download URL from backend
      const res = await api.post(`/downloads/${productId}/request`);
      if (res.data.success && res.data.downloadUrl) {
        // Trigger secure file download
        const link = document.createElement('a');
        link.href = res.data.downloadUrl;
        link.download = `${productTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setDownloadError(res.data.message || 'Failed to generate secure download link.');
      }
    } catch (err: any) {
      setDownloadError(err.response?.data?.message || 'Download error. Please check entitlement status.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Purchases</h1>
        <p className="text-gray-400 text-xs mt-1">
          Access your purchased software packages, documentation, and authenticated download links.
        </p>
      </div>

      {downloadError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-surface/50 rounded-2xl animate-pulse border border-border/40" />
          ))}
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-6">
          {purchases.map((item) => {
            const product = item.product;
            const order = item.order;
            if (!product) return null;

            return (
              <div
                key={item._id}
                className="bg-surface/90 border border-border/80 rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-200 space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-16 h-16 rounded-xl object-cover border border-border/60"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-lg text-white">{product.title}</h3>
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Access Granted ✓
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>Purchased: {new Date(item.grantedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Order ID: <code className="font-mono text-gray-300">{order?.orderId || 'ORD-VERIFIED'}</code></span>
                        <span>•</span>
                        <span>Version: <span className="font-mono text-primary-400 font-semibold">v{item.purchasedVersion || '1.0.0'}</span></span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/projects/${product.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-primary-400 hover:text-primary-300"
                  >
                    <span>Open Product Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Actions Grid (Requirement #15) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  
                  {/* Download Source Code Button */}
                  <button
                    disabled={downloadingId === product._id}
                    onClick={() => handleDownload(product._id, product.title)}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-xs shadow-glow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {downloadingId === product._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Source (.ZIP)</span>
                      </>
                    )}
                  </button>

                  {/* Documentation */}
                  <Link
                    to={`/projects/${product.slug}?tab=deliverables`}
                    className="py-3 px-4 rounded-xl bg-surface-hover border border-border text-gray-200 hover:text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-primary-400" />
                    <span>Documentation & PPT</span>
                  </Link>

                  {/* Setup Guide */}
                  <Link
                    to={`/projects/${product.slug}?tab=viva`}
                    className="py-3 px-4 rounded-xl bg-surface-hover border border-border text-gray-200 hover:text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Wrench className="w-4 h-4 text-accent-400" />
                    <span>Setup Guide & Viva</span>
                  </Link>

                  {/* WhatsApp Developer Support */}
                  <div className="flex items-center justify-center">
                    <WhatsAppButton
                      variant="inline"
                      label="WhatsApp Support"
                      customMessage={`Hi, I purchased ${product.title} (Order ${order?.orderId || ''}) and need assistance.`}
                    />
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface/40 rounded-2xl border border-border/60 space-y-3">
          <Sparkles className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Purchases Yet</h3>
          <p className="text-gray-400 text-xs">Explore our production software marketplace to get started.</p>
          <Link
            to="/projects"
            className="mt-2 inline-block bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-glow-sm"
          >
            Explore Projects Catalog
          </Link>
        </div>
      )}

    </div>
  );
};
