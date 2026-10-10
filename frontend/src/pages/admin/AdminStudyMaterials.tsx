import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  FileText,
  Sparkles,
  AlertCircle,
  Filter,
} from 'lucide-react';
import api from '../../services/api';

export interface AdminMaterialItem {
  _id: string;
  title: string;
  description?: string;
  university: string;
  branch: string;
  year?: string;
  semester: string;
  subject: string;
  materialType: 'NOTES' | 'PYQ' | 'PPT' | 'SYLLABUS' | 'LAB_MANUAL' | 'OTHER';
  fileName: string;
  storageKey: string;
  fileSize: number;
  mimeType?: string;
  isPublished: boolean;
  createdAt: string;
}

export const AdminStudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<AdminMaterialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [universityFilter, setUniversityFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    university: 'AKTU',
    branch: 'CSE',
    year: '1',
    semester: '1',
    subject: '',
    materialType: 'NOTES' as 'NOTES' | 'PYQ' | 'PPT' | 'SYLLABUS' | 'LAB_MANUAL' | 'OTHER',
    fileName: '',
    fileBase64: '',
    mimeType: '',
    isPublished: true,
  });
  const [formError, setFormError] = useState<string>('');
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (universityFilter !== 'ALL') params.append('university', universityFilter);
      if (branchFilter !== 'ALL') params.append('branch', branchFilter);
      if (yearFilter !== 'ALL') params.append('year', yearFilter);
      if (materialTypeFilter !== 'ALL') params.append('materialType', materialTypeFilter);
      if (statusFilter !== 'ALL') params.append('isPublished', statusFilter);
      params.append('limit', '50');

      const res = await api.get(`/admin/study-materials?${params.toString()}`);
      if (res.data.success) {
        setMaterials(res.data.materials);
      }
    } catch (error) {
      console.error('Failed to fetch admin study materials', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [search, universityFilter, branchFilter, yearFilter, materialTypeFilter, statusFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64Content = result.split(',')[1] || '';
        setFormData((prev) => ({
          ...prev,
          fileName: file.name,
          fileBase64: base64Content,
          mimeType: file.type,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      university: 'AKTU',
      branch: 'CSE',
      year: '1',
      semester: '1',
      subject: '',
      materialType: 'NOTES',
      fileName: '',
      fileBase64: '',
      mimeType: '',
      isPublished: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminMaterialItem) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description || '',
      university: item.university,
      branch: item.branch,
      year: item.year || (item.semester ? String(Math.ceil(Number(item.semester) / 2)) : '1'),
      semester: item.semester,
      subject: item.subject,
      materialType: item.materialType,
      fileName: item.fileName,
      fileBase64: '',
      mimeType: item.mimeType || '',
      isPublished: item.isPublished,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: AdminMaterialItem) => {
    try {
      const res = await api.put(`/admin/study-materials/${item._id}`, {
        isPublished: !item.isPublished,
      });
      if (res.data.success) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Failed to toggle publish status', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will remove the file permanently.`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/study-materials/${id}`);
      if (res.data.success) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Failed to delete study material', error);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formData.subject.trim()) {
      setFormError('Subject is required');
      return;
    }
    if (!editingId && !formData.fileBase64) {
      setFormError('Please select a file to upload');
      return;
    }

    try {
      setFormSubmitting(true);
      if (editingId) {
        const payload: any = { ...formData };
        if (!payload.fileBase64) {
          delete payload.fileBase64;
        }
        await api.put(`/admin/study-materials/${editingId}`, payload);
      } else {
        await api.post('/admin/study-materials', formData);
      }
      setIsModalOpen(false);
      fetchMaterials();
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Failed to save study material');
    } finally {
      setFormSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">17. Free Study Materials & PYQs</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage public free study materials, lecture notes, PYQs, and lab manuals.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-glow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface border border-border/80 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search material title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border/60 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={universityFilter}
          onChange={(e) => setUniversityFilter(e.target.value)}
          className="bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Universities</option>
          <option value="AKTU">AKTU</option>
          <option value="VTU">VTU</option>
          <option value="DU">DU</option>
          <option value="RGPV">RGPV</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CIVIL">CIVIL</option>
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select
          value={materialTypeFilter}
          onChange={(e) => setMaterialTypeFilter(e.target.value)}
          className="bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Resource Types</option>
          <option value="NOTES">NOTES</option>
          <option value="PYQ">PYQ</option>
          <option value="PPT">PPT</option>
          <option value="LAB_MANUAL">LAB_MANUAL</option>
          <option value="SYLLABUS">SYLLABUS</option>
          <option value="OTHER">OTHER</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Status</option>
          <option value="true">Published Only</option>
          <option value="false">Draft Only</option>
        </select>
      </div>

      {/* Materials Data Table */}
      <div className="bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400 font-mono">Loading study materials...</div>
        ) : materials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-background/80 uppercase font-mono text-[10px] text-gray-400 border-b border-border/60">
                <tr>
                  <th className="px-4 py-3">Title & Subject</th>
                  <th className="px-4 py-3">University</th>
                  <th className="px-4 py-3">Branch / Year / Sem</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">File Name & Size</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {materials.map((item) => (
                  <tr key={item._id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <div className="text-white font-bold max-w-xs truncate">{item.title}</div>
                      <div className="text-[11px] text-emerald-400">{item.subject}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-background px-2 py-0.5 rounded font-mono text-[11px] border border-border/40">
                        {item.university}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span>{item.branch}</span>
                      <span className="text-gray-500">
                        {' '}• {item.year ? `${item.year === '1' ? '1st' : item.year === '2' ? '2nd' : item.year === '3' ? '3rd' : `${item.year}th`} Yr` : `${Math.ceil(Number(item.semester) / 2) || 1} Yr`} • Sem {item.semester}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[10px]">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {item.materialType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <div className="truncate max-w-[140px] text-gray-300">{item.fileName}</div>
                      <div className="text-[10px] font-mono">{formatFileSize(item.fileSize)}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          item.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}
                      >
                        {item.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{item.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <a
                        href={`/api/study-materials/${item._id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 inline-block text-gray-400 hover:text-emerald-400 transition-colors"
                        title="Test Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        title="Edit Metadata"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-400">
            No study materials found. Click "Upload Study Material" to create your first entry.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border/80 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingId ? 'Edit Study Material' : 'Upload New Study Material'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms Handwritten Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Subject & University */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Subject Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. DBMS, Operating Systems"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">University *</label>
                  <input
                    type="text"
                    placeholder="e.g. AKTU, VTU, DU"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Branch, Year, Semester, Material Type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Branch *</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="BCA">BCA</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Year *</label>
                  <select
                    value={formData.year}
                    onChange={(e) => {
                      const yr = e.target.value;
                      setFormData({
                        ...formData,
                        year: yr,
                        semester: String((Number(yr) * 2) - 1),
                      });
                    }}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Semester *</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => {
                      const sem = e.target.value;
                      const semNum = Number(sem);
                      const yr = String(Math.ceil(semNum / 2) || '1');
                      setFormData({ ...formData, semester: sem, year: yr });
                    }}
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={String(s)}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Type *</label>
                  <select
                    value={formData.materialType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        materialType: e.target.value as any,
                      })
                    }
                    className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="NOTES">NOTES</option>
                    <option value="PYQ">PYQ</option>
                    <option value="PPT">PPT</option>
                    <option value="LAB_MANUAL">LAB_MANUAL</option>
                    <option value="SYLLABUS">SYLLABUS</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief details about topics covered in this PDF / file..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* File Upload Picker */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  File Upload (PDF, PPT, DOC, ZIP) {!editingId && '*'}
                </label>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.rar"
                  onChange={handleFileChange}
                  className="w-full bg-background border border-border/60 rounded-xl p-2 text-gray-300 text-xs"
                />
                {formData.fileName && (
                  <p className="text-[11px] text-emerald-400 mt-1">
                    Selected File: <strong>{formData.fileName}</strong>
                  </p>
                )}
              </div>

              {/* Published Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-background border-border"
                />
                <label htmlFor="isPublishedCheck" className="text-gray-200 font-semibold">
                  Publish immediately (Visible on website)
                </label>
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-xl disabled:opacity-50"
                >
                  {formSubmitting ? 'Uploading...' : editingId ? 'Update Material' : 'Upload Material'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
