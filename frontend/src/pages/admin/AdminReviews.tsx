import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reviews/list');
      if (res.data.success) setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, isApproved: boolean) => {
    try {
      const res = await api.post(`/admin/reviews/${id}/moderate`, { isApproved });
      if (res.data.success) fetchReviews();
    } catch (err) {
      alert('Error moderating review');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Verified Customer Review Moderation</h1>
        <p className="text-gray-400 text-xs mt-1">Approve, reject, or hide reviews submitted by verified buyers.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading reviews...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Review Content</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-surface-hover">
                    <td className="p-3.5 font-bold text-white">{r.user?.name || 'Customer'}</td>
                    <td className="p-3.5 text-accent-400">{r.product?.title || 'Product'}</td>
                    <td className="p-3.5 font-bold text-yellow-400 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{r.rating}/5</span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-gray-300">{r.comment}</td>
                    <td className="p-3.5">
                      {r.isApproved ? (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                          APPROVED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-yellow-500/10 text-yellow-400">
                          PENDING MODERATION
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleModerate(r._id, true)}
                        className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 font-bold text-[10px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(r._id, false)}
                        className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 font-bold text-[10px]"
                      >
                        Reject
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
