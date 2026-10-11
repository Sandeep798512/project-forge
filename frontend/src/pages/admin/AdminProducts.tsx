import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, Copy, Sparkles, X, Save, Upload, FileText, Download, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'assets'>('info');
  const [savingProduct, setSavingProduct] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quick Category Creation State inside Admin Modal
  const [showAddCatInput, setShowAddCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Selected product for asset upload/edit
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductAssets, setEditingProductAssets] = useState<any[]>([]);

  // Asset upload form state
  const [assetType, setAssetType] = useState<string>('SOURCE_CODE');
  const [assetTitle, setAssetTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);

  const initialFormState = {
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    price: 999,
    originalPrice: 1999,
    category: '',
    techStack: 'React, Node.js, Express, MongoDB',
    difficulty: 'Intermediate',
    thumbnail: '',
    screenshots: [],
    liveDemoUrl: '',
    demoVideoUrl: '',
    currentVersion: '1.0.0',
    isPublished: true,
    hasCode: true,
    hasPPT: true,
    hasReport: true,
    hasSupport: true,
    hasDoc: true,
    hasDocumentation: true,
    hasVivaQA: true,
    hasSetupSupport: true,
  };

  const [formData, setFormData] = useState<any>(initialFormState);

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

  const handleQuickCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      setCreatingCat(true);
      const slug = newCatName.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
      const res = await api.post('/admin/categories/crud', {
        action: 'create',
        name: newCatName.trim(),
        slug,
        description: `${newCatName.trim()} projects`,
      });

      if (res.data.success) {
        const catRes = await api.get('/categories');
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
          const createdCat = catRes.data.categories.find((c: any) => c.slug === slug || c.name === newCatName.trim());
          if (createdCat) {
            setFormData((prev: any) => ({ ...prev, category: createdCat._id }));
          }
        }
        setNewCatName('');
        setShowAddCatInput(false);
        setStatusMessage({ type: 'success', text: `Category "${newCatName}" created & selected!` });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating category');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setEditingProductAssets([]);
    setFormData({
      ...initialFormState,
      category: categories[0]?._id || '',
    });
    setStatusMessage(null);
    setActiveTab('info');
    setShowAddCatInput(false);
    setModalOpen(true);
  };

  const handleEditProduct = (p: any) => {
    setEditingProductId(p._id);
    setFormData({
      ...p,
      category: p.category?._id || p.category || categories[0]?._id,
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack,
      screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
      hasCode: p.hasCode !== false,
      hasPPT: p.hasPPT !== false,
      hasReport: p.hasReport !== false,
      hasSupport: p.hasSupport !== undefined ? p.hasSupport !== false : p.hasSetupSupport !== false,
      hasDoc: p.hasDoc !== undefined ? p.hasDoc !== false : p.hasDocumentation !== false,
      hasDocumentation: p.hasDoc !== undefined ? p.hasDoc !== false : p.hasDocumentation !== false,
      hasVivaQA: p.hasVivaQA !== false,
      hasSetupSupport: p.hasSupport !== undefined ? p.hasSupport !== false : p.hasSetupSupport !== false,
    });
    setStatusMessage(null);
    setModalOpen(true);
    setActiveTab('info');
    setShowAddCatInput(false);
    fetchProductAssets(p._id);
  };

  const handleEditProductAssets = async (p: any) => {
    setEditingProductId(p._id);
    setFormData({
      ...p,
      category: p.category?._id || p.category || categories[0]?._id,
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack,
      screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
      hasCode: p.hasCode !== false,
      hasPPT: p.hasPPT !== false,
      hasReport: p.hasReport !== false,
      hasSupport: p.hasSupport !== undefined ? p.hasSupport !== false : p.hasSetupSupport !== false,
      hasDoc: p.hasDoc !== undefined ? p.hasDoc !== false : p.hasDocumentation !== false,
      hasDocumentation: p.hasDoc !== undefined ? p.hasDoc !== false : p.hasDocumentation !== false,
      hasVivaQA: p.hasVivaQA !== false,
      hasSetupSupport: p.hasSupport !== undefined ? p.hasSupport !== false : p.hasSetupSupport !== false,
    });
    setStatusMessage(null);
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProduct(true);
      setStatusMessage(null);

      const defaultThumbnail = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';

      const payload = {
        ...formData,
        thumbnail: formData.thumbnail ? formData.thumbnail.trim() : defaultThumbnail,
        screenshots: Array.isArray(formData.screenshots) ? formData.screenshots : [],
        techStack: typeof formData.techStack === 'string' ? formData.techStack.split(',').map((s: string) => s.trim()) : formData.techStack,
        category: formData.category || categories[0]?._id,
        hasCode: formData.hasCode !== false,
        hasPPT: formData.hasPPT !== false,
        hasReport: formData.hasReport !== false,
        hasSupport: formData.hasSupport !== false,
        hasDoc: formData.hasDoc !== false,
        hasDocumentation: formData.hasDoc !== false,
        hasSetupSupport: formData.hasSupport !== false,
        hasVivaQA: formData.hasVivaQA !== false,
        deliverables: [
          ...(formData.hasCode !== false ? [{ name: 'Complete Source Code & DB Exports', included: true, fileKey: 'packages/sample-project.zip' }] : []),
          ...(formData.hasReport !== false ? [{ name: 'Complete Project Report & Synopsis', included: true }] : []),
          ...(formData.hasPPT !== false ? [{ name: 'PPT Presentation Slides', included: true }] : []),
          ...(formData.hasDoc !== false ? [{ name: 'Project Documentation & Setup Guide', included: true }] : []),
          ...(formData.hasVivaQA !== false ? [{ name: 'Viva Voce QA Bank', included: true }] : []),
          ...(formData.hasSupport !== false ? [{ name: 'WhatsApp Setup Support', included: true }] : []),
        ],
      };

      let res;
      if (editingProductId) {
        res = await api.put(`/admin/products/${editingProductId}`, payload);
      } else {
        res = await api.post('/admin/products', payload);
      }

      if (res.data.success) {
        const savedProd = res.data.product;
        if (savedProd && savedProd._id) {
          setEditingProductId(savedProd._id);
          fetchProductAssets(savedProd._id);
        }
        fetchData();
        setStatusMessage({
          type: 'success',
          text: editingProductId ? 'Product details updated successfully!' : 'New product created! You can now upload digital files in the tab above.',
        });

        // Automatically switch to Digital Files & Assets tab if creating new product
        if (!editingProductId) {
          setActiveTab('assets');
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error saving product information',
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleAssetUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !selectedFile) return;

    try {
      setUploadingAsset(true);
      setStatusMessage(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        const defaultTitle = assetType === 'SOURCE_CODE' ? 'Complete Source Code (.ZIP)'
          : assetType === 'DOCUMENTATION' ? 'IEEE Documentation (.PDF)'
          : assetType === 'PPT' ? 'Project Presentation (.PPTX)'
          : assetType === 'SETUP_GUIDE' ? 'Step-by-Step Setup Guide (.PDF)'
          : assetType === 'VIVA' ? 'Viva Voce QA Bank (.PDF)'
          : assetType === 'PROJECT_REPORT' ? 'Complete Project Report (.PDF)'
          : 'Digital Deliverable File';

        const res = await api.post(`/admin/products/${editingProductId}/assets`, {
          assetType,
          title: assetTitle.trim() || defaultTitle,
          fileName: selectedFile.name,
          fileBase64: base64Content,
          mimeType: selectedFile.type,
        });

        if (res.data.success) {
          setSelectedFile(null);
          setAssetTitle('');
          fetchProductAssets(editingProductId);
          setStatusMessage({ type: 'success', text: `File "${selectedFile.name}" uploaded successfully!` });
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload asset file.' });
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
        setStatusMessage({ type: 'success', text: 'Asset file deleted successfully.' });
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Failed to delete asset file.' });
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product package?')) {
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
          onClick={handleOpenCreateModal}
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
                  <th className="p-3.5">Files & Assets</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-hover">
                    <td className="p-3.5 flex items-center space-x-3 font-bold">
                      <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span>{p.title}</span>
                        <div className="text-[10px] text-emerald-400 font-mono font-normal">
                          {[
                            p.hasCode !== false && 'Code',
                            p.hasPPT !== false && 'PPT',
                            p.hasReport !== false && 'Report',
                            (p.hasSupport ?? p.hasSetupSupport) !== false && 'Support',
                            (p.hasDoc ?? p.hasDocumentation) !== false && 'Doc'
                          ].filter(Boolean).join(' + ')}
                        </div>
                      </div>
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
                        onClick={() => handleEditProduct(p)}
                        className="p-1.5 text-gray-400 hover:text-primary-400 transition-colors"
                        title="Edit Product Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
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
                <h3 className="font-bold text-base text-white">
                  {editingProductId ? 'Edit Product & Deliverables' : 'Create New Product Package'}
                </h3>
                <div className="flex space-x-1 bg-background p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'info' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    1. Product Details
                  </button>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'assets' ? 'bg-accent-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    2. Digital Files & Assets ({editingProductAssets.length})
                  </button>
                </div>
              </div>

              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Tab 1: Product Information Form */}
            {activeTab === 'info' && (
              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      })
                    }
                    placeholder="e.g. Job Portal & Career Opportunities Hub"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">
                    URL Slug <span className="text-[10px] text-gray-400 font-normal">(Auto-generated website page link - No need to change unless needed)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-gray-300">Category</label>
                      <button
                        type="button"
                        onClick={() => setShowAddCatInput(!showAddCatInput)}
                        className="text-[10px] text-accent-400 hover:text-accent-300 font-bold flex items-center space-x-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{showAddCatInput ? 'Cancel' : '+ Add New Category'}</span>
                      </button>
                    </div>

                    {!showAddCatInput ? (
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Enter category (e.g. Full Stack)"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="flex-1 bg-background border border-accent-500/50 rounded-xl px-2.5 py-1.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          disabled={creatingCat || !newCatName.trim()}
                          onClick={handleQuickCreateCategory}
                          className="px-2.5 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs disabled:opacity-50 flex-shrink-0"
                        >
                          {creatingCat ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Difficulty Level</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Selling Price (₹)</label>
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
                  <label className="block font-semibold text-gray-300 mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                  />
                </div>

                {/* Main Cover / Thumbnail Image Selector */}
                <div className="space-y-2 p-4 rounded-xl bg-background border border-border/80">
                  <label className="block font-bold text-gray-200 text-xs flex items-center justify-between">
                    <span>Main Cover / Thumbnail Image</span>
                    <span className="text-[10px] text-gray-400 font-normal">URL or Upload File</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        placeholder="Paste Image URL (e.g. https://images.unsplash.com/...)"
                        value={formData.thumbnail || ''}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-gray-100 text-xs"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-gray-400">OR Upload Local Photo:</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setFormData({ ...formData, thumbnail: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-[10px] text-gray-300 file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary-600 file:text-white"
                        />
                      </div>
                    </div>

                    {formData.thumbnail && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-slate-950 flex items-center justify-center p-0.5">
                        <img src={formData.thumbnail} alt="Thumbnail preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Multiple Screenshots Gallery */}
                <div className="space-y-3 p-4 rounded-xl bg-background border border-border/80">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-gray-200 text-xs">
                      Product Screenshots & Gallery ({formData.screenshots?.length || 0})
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        id="screenshot-file-input"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setFormData((prev: any) => ({
                                ...prev,
                                screenshots: [...(prev.screenshots || []), reader.result as string],
                              }));
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                      <label
                        htmlFor="screenshot-file-input"
                        className="px-2.5 py-1 rounded-lg bg-accent-600 hover:bg-accent-500 text-white font-bold text-[10px] cursor-pointer flex items-center space-x-1 shadow-glow-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Upload Screenshots (One or Multiple)</span>
                      </label>
                    </div>
                  </div>

                  {/* Added Screenshots Preview Grid */}
                  {formData.screenshots && formData.screenshots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {formData.screenshots.map((src: string, idx: number) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-border h-24 bg-slate-950 flex items-center justify-center p-0.5">
                          <img src={src} alt={`Screenshot ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev: any) => ({
                                ...prev,
                                screenshots: prev.screenshots.filter((_: any, i: number) => i !== idx),
                              }));
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-90 transition-opacity z-10"
                            title="Remove screenshot"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-500 italic text-center py-3 border border-dashed border-border/60 rounded-lg">
                      No screenshots added yet. Click "Upload Screenshots" above to select one or multiple photos from your computer.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="React, Node.js, Express, MongoDB"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                  />
                </div>

                {/* Deliverables & Badge Inclusions Checkboxes */}
                <div className="space-y-3 p-4 rounded-xl bg-background border border-border/80">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-gray-200 text-xs">
                      Included Package Deliverables & Card Badges
                    </label>
                    <span className="text-[10px] text-gray-400">Mark whatever is included in this project</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <label className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${formData.hasCode !== false ? 'bg-primary-950/20 border-primary-500/50 text-white' : 'bg-surface border-border/60 text-gray-400'}`}>
                      <input
                        type="checkbox"
                        checked={formData.hasCode !== false}
                        onChange={(e) => setFormData({ ...formData, hasCode: e.target.checked })}
                        className="rounded border-border text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="font-semibold">Code (Source Code)</span>
                    </label>

                    <label className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${formData.hasPPT !== false ? 'bg-primary-950/20 border-primary-500/50 text-white' : 'bg-surface border-border/60 text-gray-400'}`}>
                      <input
                        type="checkbox"
                        checked={formData.hasPPT !== false}
                        onChange={(e) => setFormData({ ...formData, hasPPT: e.target.checked })}
                        className="rounded border-border text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="font-semibold">PPT (Slides)</span>
                    </label>

                    <label className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${formData.hasReport !== false ? 'bg-primary-950/20 border-primary-500/50 text-white' : 'bg-surface border-border/60 text-gray-400'}`}>
                      <input
                        type="checkbox"
                        checked={formData.hasReport !== false}
                        onChange={(e) => setFormData({ ...formData, hasReport: e.target.checked })}
                        className="rounded border-border text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="font-semibold">Report (Project Report)</span>
                    </label>

                    <label className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${formData.hasSupport !== false ? 'bg-primary-950/20 border-primary-500/50 text-white' : 'bg-surface border-border/60 text-gray-400'}`}>
                      <input
                        type="checkbox"
                        checked={formData.hasSupport !== false}
                        onChange={(e) => setFormData({ ...formData, hasSupport: e.target.checked, hasSetupSupport: e.target.checked })}
                        className="rounded border-border text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="font-semibold">Support (Setup Support)</span>
                    </label>

                    <label className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${formData.hasDoc !== false ? 'bg-primary-950/20 border-primary-500/50 text-white' : 'bg-surface border-border/60 text-gray-400'}`}>
                      <input
                        type="checkbox"
                        checked={formData.hasDoc !== false}
                        onChange={(e) => setFormData({ ...formData, hasDoc: e.target.checked, hasDocumentation: e.target.checked })}
                        className="rounded border-border text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="font-semibold">Doc (Documentation)</span>
                    </label>

                    <label className={`flex items-center space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${formData.hasVivaQA !== false ? 'bg-primary-950/20 border-primary-500/50 text-white' : 'bg-surface border-border/60 text-gray-400'}`}>
                      <input
                        type="checkbox"
                        checked={formData.hasVivaQA !== false}
                        onChange={(e) => setFormData({ ...formData, hasVivaQA: e.target.checked })}
                        className="rounded border-border text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="font-semibold">Viva QA Bank</span>
                    </label>
                  </div>

                  {/* Live Card Badge Preview */}
                  <div className="mt-2 p-2.5 rounded-lg bg-surface/90 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-gray-400 font-medium">Card Badge Preview:</span>
                    <span className="font-bold text-emerald-400 font-mono tracking-wide">
                      {[
                        formData.hasCode !== false && 'Code',
                        formData.hasPPT !== false && 'PPT',
                        formData.hasReport !== false && 'Report',
                        formData.hasSupport !== false && 'Support',
                        formData.hasDoc !== false && 'Doc'
                      ].filter(Boolean).join(' + ') || '(None)'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">
                      Live Deployed App URL <span className="text-[10px] text-primary-400 font-normal">(Vercel / Render / Netlify Link)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.liveDemoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                      placeholder="e.g. https://demo-project.vercel.app/"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">
                      Demo Video URL <span className="text-[10px] text-primary-400 font-normal">(YouTube Video Link)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.demoVideoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
                    />
                  </div>
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
                    disabled={savingProduct}
                    className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold flex items-center space-x-1 shadow-glow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProduct ? 'Saving...' : editingProductId ? 'Update Product Details' : 'Save & Continue to File Uploads'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Digital Asset File Uploader */}
            {activeTab === 'assets' && (
              <div className="space-y-6 text-xs">
                
                {!editingProductId ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                    <h4 className="font-bold text-sm text-white">Save Product Details First</h4>
                    <p className="text-gray-300 text-xs max-w-md mx-auto">
                      Please fill in the product information in the <b>Product Details</b> tab and click <b>Save & Continue</b>. Once saved, you can immediately upload and attach all deliverable files (PDF, PPT, ZIP) here!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('info')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-glow-sm"
                    >
                      Go to 1. Product Details Tab
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Upload Form Box */}
                    <div className="bg-background border border-border/80 rounded-2xl p-5 space-y-4">
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <Upload className="w-4 h-4 text-accent-400" />
                        <span>Upload Digital Deliverable File (PDF, PPTX, ZIP)</span>
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
                              <option value="SETUP_GUIDE">Step-by-Step Setup Guide (.PDF)</option>
                              <option value="VIVA">Viva Voce QA Bank (.PDF)</option>
                              <option value="PROJECT_REPORT">Complete Project Report (.PDF)</option>
                              <option value="ARCHITECTURE">Architecture Diagram (.PNG/.PDF)</option>
                              <option value="OTHER">Other Deliverable Asset</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-300 mb-1">Custom Display Title (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. Complete Source Code (.ZIP)"
                              value={assetTitle}
                              onChange={(e) => setAssetTitle(e.target.value)}
                              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-gray-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-300 mb-1">Select File from Computer</label>
                          <input
                            type="file"
                            required
                            onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-accent-600 file:text-white hover:file:bg-accent-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={uploadingAsset || !selectedFile}
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
                        Uploaded Digital Files for this Product ({editingProductAssets.length})
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
                                title="Delete File"
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
                  </>
                )}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
