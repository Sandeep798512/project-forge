import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Wrench, MessageSquare, ExternalLink, ShieldAlert, Sparkles, BookOpen, Presentation, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import api from '../../services/api';

export const MyPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingAssetId, setDownloadingAssetId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
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

  const handleAssetDownload = async (productId: string, asset: any, productTitle: string) => {
    try {
      setDownloadingAssetId(asset._id);
      setDownloadError(null);

      // Request secure signed download URL from backend for specific asset
      const res = await api.post(`/downloads/${productId}/assets/${asset._id}/request`);

      if (res.data.success && res.data.downloadUrl) {
        const downloadUrl = res.data.downloadUrl;
        const mimeType = res.data.mimeType;

        // If PDF, open directly in browser tab, else trigger download link
        if (mimeType === 'application/pdf') {
          window.open(downloadUrl, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = asset.originalName || `${productTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        setDownloadError(res.data.message || 'Failed to generate secure download link.');
      }
    } catch (err: any) {
      setDownloadError(err.response?.data?.message || 'Download error. Please check entitlement status.');
    } finally {
      setDownloadingAssetId(null);
    }
  };

  const renderAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'SOURCE_CODE':
        return <Download className="w-4 h-4" />;
      case 'DOCUMENTATION':
        return <FileText className="w-4 h-4 text-primary-400" />;
      case 'PPT':
        return <Presentation className="w-4 h-4 text-yellow-400" />;
      case 'SETUP_GUIDE':
        return <Wrench className="w-4 h-4 text-accent-400" />;
      case 'VIVA':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Purchases & Resources</h1>
        <p className="text-gray-400 text-xs mt-1">
          Access your purchased software source code, IEEE documentation PDFs, presentation decks, setup guides, and viva questions.
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
            <div key={i} className="h-48 bg-surface/50 rounded-2xl animate-pulse border border-border/40" />
          ))}
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-6">
          {purchases.map((item) => {
            const product = item.product;
            const order = item.order;
            if (!product) return null;

            const assets: any[] = product.assets || [];

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
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Access Granted</span>
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

                {/* Dynamic Resource Action Buttons */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                    Available Purchased Assets & Deliverables ({assets.length})
                  </h4>

                  {assets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {assets.map((asset) => {
                        const isLoadingThis = downloadingAssetId === asset._id;
                        const isSource = asset.assetType === 'SOURCE_CODE';

                        return (
                          <button
                            key={asset._id}
                            disabled={isLoadingThis}
                            onClick={() => handleAssetDownload(product._id, asset, product.title)}
                            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all disabled:opacity-50 ${
                              isSource
                                ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-glow-sm'
                                : 'bg-surface-hover border border-border text-gray-200 hover:text-white hover:border-primary-500/40'
                            }`}
                          >
                            <div className="flex items-center space-x-2 overflow-hidden">
                              {renderAssetIcon(asset.assetType)}
                              <span className="truncate">{asset.title}</span>
                            </div>

                            {isLoadingThis ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2 flex-shrink-0" />
                            ) : (
                              <span className="text-[10px] font-mono opacity-60 ml-2 uppercase flex-shrink-0">
                                {asset.assetType === 'DOCUMENTATION' || asset.assetType === 'VIVA' ? 'OPEN' : 'DL'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic bg-background p-4 rounded-xl border border-border/60">
                      No standalone file assets configured yet for this package.
                    </div>
                  )}

                  {/* WhatsApp Support CTA */}
                  <div className="pt-2 flex justify-end">
                    <WhatsAppButton
                      variant="inline"
                      label="Need Live Setup Help? Contact Developer"
                      customMessage={`Hi, I purchased ${product.title} (Order ${order?.orderId || ''}) and need assistance with project setup.`}
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
