import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, Save, X } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    price: 999,
    originalPrice: 1999,
    category: '',
    techStack: 'React, Node.js, Express, MongoDB',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    currentVersion: '1.0.0',
    isPublished: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=50'),
        api.get('/categories'),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        techStack: typeof formData.techStack === 'string' ? formData.techStack.split(',').map((s: string) => s.trim()) : formData.techStack,
        category: formData.category || categories[0]?._id,
        deliverables: [
          { name: 'Complete Source Code', included: true, fileKey: 'packages/sample-project.zip' },
          { name: 'Documentation & PPT', included: true },
          { name: 'Viva Voce QA Bank', included: true },
        ],
      };

      const res = await api.post('/admin/products', payload);
      if (res.data.success) {
        setModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await api.delete(`/admin/products/${id}`);
      fetchData();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Package Management</h1>
          <p className="text-gray-400 text-xs mt-1">Create, update, version, and manage marketplace source code packages.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-glow-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading product packages...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                <tr>
                  <th className="p-3.5">Product Package</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Version</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-hover">
                    <td className="p-3.5 flex items-center space-x-3 font-bold">
                      <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                      <span>{p.title}</span>
                    </td>
                    <td className="p-3.5 text-gray-400">{p.category?.name || 'General'}</td>
                    <td className="p-3.5 font-bold text-white">{BRAND.currency.symbol}{p.price}</td>
                    <td className="p-3.5 font-mono text-primary-400">v{p.currentVersion || '1.0.0'}</td>
                    <td className="p-3.5">
                      {p.isPublished ? (
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating New Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-white">Create New Project Package</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Full Description (Markdown)</label>
                <textarea
                  rows={4}
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-hover border border-border text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Product</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
