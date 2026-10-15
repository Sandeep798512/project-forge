import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Search,
  Upload,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  X,
  Calendar,
  Clock,
} from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import api from '../../services/api';

const TRACKS = [
  'Placement Prep',
  'Career Roadmap',
  'DSA & Coding',
  'Core CS (OS, DBMS, CN)',
  'System Design',
  'Company Specific (TCS, Infosys, Amazon)',
  'Resume & HR Interview',
  'Cheat Sheet',
];

export const AdminPlacementPrep: React.FC = () => {
  const getInitialMaterials = () => {
    try {
      const cached = sessionStorage.getItem('cg_admin_placement_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  };

  const initialMats = getInitialMaterials();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [materials, setMaterials] = useState<any[]>(initialMats);
  const [loading, setLoading] = useState<boolean>(initialMats.length === 0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [search, setSearch] = useState<string>('');
  const [trackFilter, setTrackFilter] = useState<string>('ALL');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    careerTrack: 'Placement Prep',
    targetRole: 'Software Engineer (SDE)',
    difficulty: 'Intermediate',
    price: 99,
    originalPrice: 499,
    pageCount: 120,
    author: 'CampusGet Placement Cell',
    shortDescription: '',
    fullDescription: '',
    featuresString: 'Top Interview Questions with Code, 1-Page Revision Cheatsheet, Real Company Insights, Instant PDF Download',
    thumbnail: '',
    isPublished: true,
  });

  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');

  useEffect(() => {
    fetchAdminMaterials();
  }, []);

  const fetchAdminMaterials = async () => {
    try {
      if (materials.length === 0) {
        setLoading(true);
      }
      const res = await api.get('/admin/placement-prep?limit=100');
      if (res.data.success) {
        setMaterials(res.data.materials);
        sessionStorage.setItem('cg_admin_placement_cache', JSON.stringify(res.data.materials));
      }
    } catch (err) {
      console.error('[FETCH ADMIN PLACEMENT PREP ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a valid .PDF document file.');
        return;
      }
      setSelectedPdfFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        // Strip data:application/pdf;base64,
        const base64Data = resultStr.split(',')[1] || resultStr;
        setPdfBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, thumbnail: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      careerTrack: 'Placement Prep',
      targetRole: 'Software Engineer (SDE)',
      difficulty: 'Intermediate',
      price: 99,
      originalPrice: 499,
      pageCount: 120,
      author: 'CampusGet Placement Cell',
      shortDescription: '',
      fullDescription: '',
      featuresString: 'Top Interview Questions with Code, 1-Page Revision Cheatsheet, Real Company Insights, Instant PDF Download',
      thumbnail: '',
      isPublished: true,
    });
    setSelectedPdfFile(null);
    setPdfBase64('');
  };

  const handleEditClick = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      slug: item.slug,
      careerTrack: item.careerTrack || 'Placement Prep',
      targetRole: item.targetRole || '',
      difficulty: item.difficulty || 'Intermediate',
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      pageCount: item.pageCount || 100,
      author: item.author || 'CampusGet Placement Cell',
      shortDescription: item.shortDescription || '',
      fullDescription: item.fullDescription || '',
      featuresString: (item.features || []).join(', '),
      thumbnail: item.thumbnail || '',
      isPublished: item.isPublished !== false,
    });
    setSelectedPdfFile(null);
    setPdfBase64('');
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.title.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a title for this material.' });
      return;
    }

    try {
      setSubmitting(true);

      const features = formData.featuresString
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload: any = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        pageCount: Number(formData.pageCount),
        features,
      };

      if (pdfBase64 && selectedPdfFile) {
        payload.fileBase64 = pdfBase64;
        payload.fileName = selectedPdfFile.name;
      }

      if (editingId) {
        // Update existing
        const res = await api.put(`/admin/placement-prep/${editingId}`, payload);
        if (res.data.success) {
          setStatusMessage({ type: 'success', text: 'Placement material updated successfully!' });
          fetchAdminMaterials();
          resetForm();
          setActiveTab('list');
        }
      } else {
        // Create new
        const res = await api.post('/admin/placement-prep', payload);
        if (res.data.success) {
          setStatusMessage({ type: 'success', text: 'New placement material uploaded & published successfully!' });
          fetchAdminMaterials();
          resetForm();
          setActiveTab('list');
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save placement material. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await api.delete(`/admin/placement-prep/${id}`);
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: `Deleted "${title}" successfully.` });
        fetchAdminMaterials();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  const handleTogglePublish = async (item: any) => {
    try {
      const res = await api.put(`/admin/placement-prep/${item._id}`, {
        isPublished: !item.isPublished,
      });
      if (res.data.success) {
        fetchAdminMaterials();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  // Filter list
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.targetRole && m.targetRole.toLowerCase().includes(search.toLowerCase()));
    const matchesTrack = trackFilter === 'ALL' || m.careerTrack === trackFilter;
    return matchesSearch && matchesTrack;
  });

  const totalPublished = materials.filter((m) => m.isPublished).length;
  const totalDownloads = materials.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white">Placement & Roadmaps Suite</h1>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Upload, price, and manage PDF e-books, career roadmaps, DSA question banks, and interview guides.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (activeTab === 'create') {
                resetForm();
                setActiveTab('list');
              } else {
                resetForm();
                setActiveTab('create');
              }
            }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-glow-sm transition-all"
          >
            {activeTab === 'create' ? (
              <>
                <BookOpen className="w-4 h-4" />
                <span>View All Materials</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Upload New Material</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface/80 border border-border/80 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400">Total Materials</span>
            <div className="text-xl font-extrabold text-white">{materials.length}</div>
          </div>
        </div>

        <div className="bg-surface/80 border border-border/80 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400">Active Live Materials</span>
            <div className="text-xl font-extrabold text-emerald-400">{totalPublished}</div>
          </div>
        </div>

        <div className="bg-surface/80 border border-border/80 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400">Total Student Deliveries</span>
            <div className="text-xl font-extrabold text-indigo-400">{totalDownloads}</div>
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: LIST VIEW */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface/80 border border-border/80 p-3 rounded-2xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search title, target role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="bg-background border border-border/60 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-auto"
            >
              <option value="ALL">All Career Tracks</option>
              {TRACKS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-xs">Loading placement materials...</div>
            ) : filteredMaterials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
                    <tr>
                      <th className="p-3.5">Cover</th>
                      <th className="p-3.5">Title & Track</th>
                      <th className="p-3.5">Target Role</th>
                      <th className="p-3.5">Pages</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Sales</th>
                      <th className="p-3.5">Date Added</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-gray-200">
                    {filteredMaterials.map((m) => (
                      <tr key={m._id} className="hover:bg-surface-hover/80 transition-colors">
                        <td className="p-3.5">
                          <img
                            src={m.thumbnail}
                            alt=""
                            className="w-14 h-9 object-contain rounded-md bg-slate-950 border border-border/60"
                          />
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <span className="font-bold text-white block line-clamp-1">{m.title}</span>
                          <span className="text-[10px] font-mono text-amber-400">{m.careerTrack || 'Placement Prep'}</span>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span>Added: {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-gray-300">
                          <span className="text-xs">{m.targetRole || 'Software Engineer'}</span>
                        </td>
                        <td className="p-3.5 font-mono text-gray-400">
                          {m.pageCount ? `${m.pageCount} p.` : '—'}
                        </td>
                        <td className="p-3.5">
                          <span className="font-extrabold text-white">₹{m.price}</span>
                          {m.originalPrice && m.originalPrice > m.price && (
                            <span className="text-[10px] text-gray-500 line-through block">₹{m.originalPrice}</span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono text-emerald-400">
                          {m.downloadCount || 0}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 text-xs text-gray-200 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span>
                              {m.createdAt
                                ? new Date(m.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono flex items-center space-x-1 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span>
                              {m.createdAt
                                ? new Date(m.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  })
                                : ''}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleTogglePublish(m)}
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                              m.isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            }`}
                          >
                            {m.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <a
                            href={`/placement-prep/${m.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-surface border border-border text-gray-300 hover:text-white inline-block"
                            title="Preview Public Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleEditClick(m)}
                            className="p-1.5 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 inline-block"
                            title="Edit Material"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(m._id, m.title)}
                            className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 inline-block"
                            title="Delete Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 text-xs">
                No placement materials found. Click "Upload New Material" above to add your first e-book or roadmap!
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: UPLOAD & EDIT FORM */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              {editingId ? 'Edit Placement Material' : 'Upload New Placement E-Book & Roadmap'}
            </h2>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                E-Book / Roadmap Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DSA 450 Mastery Guide & LeetCode Patterns"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Career Track Dropdown */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Career Track / Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.careerTrack}
                onChange={(e) => setFormData({ ...formData, careerTrack: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {TRACKS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Target Role */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Target Role / Focus
              </label>
              <input
                type="text"
                placeholder="e.g. SDE I / SDE II, Full Stack Developer, Campus Hire"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Difficulty / Year Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Beginner">Beginner (1st - 2nd Year)</option>
                <option value="Intermediate">Intermediate (Pre-Final Year)</option>
                <option value="Advanced">Advanced (Final Year / Off-Campus)</option>
              </select>
            </div>

            {/* Page Count */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Number of Pages
              </label>
              <input
                type="number"
                min="1"
                placeholder="120"
                value={formData.pageCount}
                onChange={(e) => setFormData({ ...formData, pageCount: Number(e.target.value) })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Price (₹) */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Selling Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Original Price (₹) */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Original MRP / Cross-out Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="499"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Author */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Author / Curator Name
              </label>
              <input
                type="text"
                placeholder="CampusGet Placement Cell"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-gray-200">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-border text-amber-500 focus:ring-amber-500"
                />
                <span>Publish Immediately (Make Live on Store)</span>
              </label>
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Short Description (Cards Preview)
              </label>
              <textarea
                rows={2}
                placeholder="A concise 1-2 sentence overview shown on marketplace cards..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Full Syllabus / Table of Contents */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Full Syllabus & Table of Contents (Detail Page Overview)
              </label>
              <textarea
                rows={5}
                placeholder="Module 1: Array Algorithms&#10;Module 2: Dynamic Programming Patterns&#10;Module 3: Top 50 Viva Questions..."
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
              />
            </div>

            {/* Key Features Bullet points */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Key Highlights (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="450 LeetCode Patterns, Optimal Code Explanations, Printable Cheatsheet, Instant Download"
                value={formData.featuresString}
                onChange={(e) => setFormData({ ...formData, featuresString: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Thumbnail Image */}
            <div className="md:col-span-1 space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Cover Thumbnail Image
              </label>
              <input
                type="text"
                placeholder="Paste Image URL or select file below..."
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-surface border border-border text-[11px] font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image File</span>
                  <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                </label>
              </div>

              {formData.thumbnail && (
                <div className="mt-2 aspect-video w-48 rounded-lg overflow-hidden bg-slate-950 border border-border/60 flex items-center justify-center">
                  <img src={formData.thumbnail} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>

            {/* PDF File Upload */}
            <div className="md:col-span-1 space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Deliverable PDF E-Book / Roadmap File
              </label>
              <div className="border-2 border-dashed border-border/80 hover:border-amber-500/50 rounded-xl p-4 text-center space-y-2 transition-colors">
                <FileText className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-xs text-gray-300">
                  {selectedPdfFile ? (
                    <span className="font-bold text-emerald-400 block">{selectedPdfFile.name} ({(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  ) : (
                    <span>Select the complete PDF deliverable</span>
                  )}
                </div>
                <label className="cursor-pointer inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{selectedPdfFile ? 'Change Selected PDF' : 'Choose .PDF Document'}</span>
                  <input type="file" accept="application/pdf,.pdf" onChange={handlePdfFileSelect} className="hidden" />
                </label>
              </div>
              {editingId && !selectedPdfFile && (
                <span className="text-[11px] text-gray-400 block">
                  Leave empty to retain existing attached PDF document.
                </span>
              )}
            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-glow-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving & Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? 'Update Material' : 'Publish Placement Material'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
