import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, Copy, Sparkles, X, Save, Upload, FileText, Download, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'assets'>('info');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Selected product for asset upload
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductAssets, setEditingProductAssets] = useState<any[]>([]);

  // Asset upload form state
  const [assetType, setAssetType] = useState<string>('SOURCE_CODE');
  const [assetTitle, setAssetTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);

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
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    currentVersion: '1.0.0',
    isPublished: true,
  });

  useEffect(() => {
    fetchData();
  }, [search, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get(`/admin/products/enhanced?search=${search}&category=${selectedCategory}&limit=50`),
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

  const handleEditProductAssets = async (p: any) => {
    setEditingProductId(p._id);
    setFormData({
      ...p,
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack,
    });
    setModalOpen(true);
    setActiveTab('assets');
    fetchProductAssets(p._id);
  };

  const fetchProductAssets = async (pId: string) => {
    try {
      const res = await api.get(`/admin/products/${pId}/assets`);
      if (res.data.success) setEditingProductAssets(res.data.assets);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssetUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !selectedFile) return;

    try {
      setUploadingAsset(true);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        const res = await api.post(`/admin/products/${editingProductId}/assets`, {
          assetType,
          title: assetTitle || `${formData.title} - ${assetType}`,
          fileName: selectedFile.name,
          fileBase64: base64Content,
          mimeType: selectedFile.type,
        });

        if (res.data.success) {
          setSelectedFile(null);
          setAssetTitle('');
          fetchProductAssets(editingProductId);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload asset');
    } finally {
      setUploadingAsset(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!editingProductId) return;
    if (window.confirm('Delete this asset file from private storage?')) {
      try {
        await api.delete(`/admin/products/${editingProductId}/assets/${assetId}`);
        fetchProductAssets(editingProductId);
      } catch (err) {
        alert('Failed to delete asset');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await api.post(`/admin/products/${id}/duplicate`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err: any) {
      alert('Error duplicating product');
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
          <h1 className="text-2xl font-extrabold text-white">Product Package & Asset Management</h1>
          <p className="text-gray-400 text-xs mt-1">Upload source code ZIP, Documentation PDF, Presentation PPTX, Setup Guide & Viva QA files.</p>
        </div>

        <button
          onClick={() => {
            setEditingProductId(null);
            setFormData({
              title: '',
              slug: '',
              shortDescription: '',
              fullDescription: '',
              price: 999,
              originalPrice: 1999,
              category: categories[0]?._id || '',
              techStack: 'React, Node.js, Express, MongoDB',
              difficulty: 'Intermediate',
              thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
              currentVersion: '1.0.0',
              isPublished: true,
            });
            setActiveTab('info');
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-glow-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by product title or tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-gray-100"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-gray-100"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
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
                  <th className="p-3.5">Assets</th>
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
                    <td className="p-3.5">
                      <button
                        onClick={() => handleEditProductAssets(p)}
                        className="px-2.5 py-1 rounded bg-accent-600/20 text-accent-400 font-mono font-bold text-[10px] border border-accent-500/30 flex items-center space-x-1 hover:bg-accent-600/30"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Manage Files ({p.assets?.length || 0})</span>
                      </button>
                    </td>
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
                        onClick={() => handleDuplicate(p._id)}
                        className="p-1.5 text-gray-400 hover:text-accent-400 transition-colors"
                        title="Duplicate Product"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
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

      {/* Modal for Product Info & Assets Tab */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-4">
                <h3 className="font-bold text-base text-white">Product Configuration & Assets</h3>
                <div className="flex space-x-1 bg-background p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'info' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Product Details
                  </button>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'assets' ? 'bg-accent-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Digital Files & Assets ({editingProductAssets.length})
                  </button>
                </div>
              </div>

              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab 1: Product Information Form */}
            {activeTab === 'info' && (
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
                    <span>Save Product Info</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Digital Asset File Uploader */}
            {activeTab === 'assets' && (
              <div className="space-y-6 text-xs">
                
                {/* Upload Form Box */}
                <div className="bg-background border border-border/80 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-accent-400" />
                    <span>Upload Digital Asset File (PDF, PPTX, ZIP)</span>
                  </h4>

                  <form onSubmit={handleAssetUploadSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-300 mb-1">Asset Deliverable Type</label>
                        <select
                          value={assetType}
                          onChange={(e) => setAssetType(e.target.value)}
                          className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-gray-100 font-semibold"
                        >
                          <option value="SOURCE_CODE">Source Code (.ZIP)</option>
                          <option value="DOCUMENTATION">IEEE Documentation (.PDF)</option>
                          <option value="PPT">Presentation Deck (.PPTX)</option>
                          <option value="SETUP_GUIDE">Setup Guide (.PDF)</option>
                          <option value="VIVA">Viva Voce QA Bank (.PDF)</option>
                          <option value="PROJECT_REPORT">Project Report (.PDF)</option>
                          <option value="ARCHITECTURE">Architecture Diagram (.PNG/.PDF)</option>
                          <option value="OTHER">Other Deliverable Asset</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-300 mb-1">Custom Display Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Complete Viva Voce Guide PDF"
                          value={assetTitle}
                          onChange={(e) => setAssetTitle(e.target.value)}
                          className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Select Local File</label>
                      <input
                        type="file"
                        required
                        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-accent-600 file:text-white hover:file:bg-accent-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingAsset || !editingProductId}
                      className="w-full py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold flex items-center justify-center space-x-1.5 shadow-glow-sm disabled:opacity-50"
                    >
                      {uploadingAsset ? (
                        <span>Uploading File to Protected Storage...</span>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload Deliverable Asset</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Uploaded Assets List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                    Uploaded Digital Files ({editingProductAssets.length})
                  </h4>

                  {editingProductAssets.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {editingProductAssets.map((asset) => (
                        <div
                          key={asset._id}
                          className="p-3 rounded-xl bg-background border border-border/60 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <FileText className="w-5 h-5 text-accent-400 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <h5 className="font-bold text-white truncate">{asset.title}</h5>
                              <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
                                <span className="text-primary-400 font-bold">{asset.assetType}</span>
                                <span>•</span>
                                <span>{(asset.size / 1024).toFixed(1)} KB</span>
                                <span>•</span>
                                <span>{asset.originalName}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteAsset(asset._id)}
                            className="p-1.5 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-xs border border-dashed border-border rounded-xl">
                      No files uploaded for this product package yet.
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
