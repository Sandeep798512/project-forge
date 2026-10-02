import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  GraduationCap,
  Sparkles,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  FileCode,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';

export interface StudyMaterialItem {
  _id: string;
  title: string;
  description?: string;
  university: string;
  branch: string;
  semester: string;
  subject: string;
  materialType: 'NOTES' | 'PYQ' | 'PPT' | 'SYLLABUS' | 'LAB_MANUAL' | 'OTHER';
  fileName: string;
  fileSize: number;
  mimeType?: string;
  isPublished: boolean;
  createdAt: string;
}

export const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [university, setUniversity] = useState<string>('ALL');
  const [branch, setBranch] = useState<string>('ALL');
  const [semester, setSemester] = useState<string>('ALL');
  const [materialType, setMaterialType] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (university !== 'ALL') params.append('university', university);
      if (branch !== 'ALL') params.append('branch', branch);
      if (semester !== 'ALL') params.append('semester', semester);
      if (materialType !== 'ALL') params.append('materialType', materialType);
      params.append('page', String(page));
      params.append('limit', '12');

      const res = await api.get(`/study-materials?${params.toString()}`);
      if (res.data.success) {
        setMaterials(res.data.materials);
        setTotalPages(res.data.pagination.pages || 1);
        setTotalCount(res.data.pagination.total || 0);
      }
    } catch (error) {
      console.error('Failed to load study materials', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [page, university, branch, semester, materialType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMaterials();
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return 'PDF Document';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'PYQ':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'NOTES':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PPT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'SYLLABUS':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'LAB_MANUAL':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>100% Free Educational Resources</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Free Study Materials, Notes & PYQs
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Download verified engineering lecture notes, previous year question papers, lab manuals, and syllabus copies for computer science and IT students — completely free of cost.
          </p>

          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 pt-2">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct One-Click Download</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>No Login Required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>AKTU & University Aligned</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-surface border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject name, topic, semester or keyword (e.g. Data Structures, DBMS, Operating Systems)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background/80 border border-border/60 rounded-xl pl-12 pr-28 py-3 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filter Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            
            {/* University */}
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>University</span>
              </label>
              <select
                value={university}
                onChange={(e) => { setUniversity(e.target.value); setPage(1); }}
                className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Universities</option>
                <option value="AKTU">AKTU (Dr. A.P.J. Abdul Kalam Technical Univ)</option>
                <option value="VTU">VTU (Visvesvaraya Tech Univ)</option>
                <option value="DU">Delhi University (DU)</option>
                <option value="RGPV">RGPV</option>
                <option value="SPPU">SPPU Pune</option>
                <option value="GTU">GTU Gujarat</option>
                <option value="OTHER">Other / General</option>
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Branch / Course</span>
              </label>
              <select
                value={branch}
                onChange={(e) => { setBranch(e.target.value); setPage(1); }}
                className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Branches</option>
                <option value="CSE">CSE (Computer Science & Engg)</option>
                <option value="IT">IT (Information Technology)</option>
                <option value="ECE">ECE (Electronics & Comm)</option>
                <option value="ME">ME (Mechanical Engg)</option>
                <option value="CIVIL">Civil Engg</option>
                <option value="BCA">BCA / MCA</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Semester</span>
              </label>
              <select
                value={semester}
                onChange={(e) => { setSemester(e.target.value); setPage(1); }}
                className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Semesters</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>

            {/* Material Type */}
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resource Type</span>
              </label>
              <select
                value={materialType}
                onChange={(e) => { setMaterialType(e.target.value); setPage(1); }}
                className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Resource Types</option>
                <option value="NOTES">Lecture Notes</option>
                <option value="PYQ">Previous Year Questions (PYQ)</option>
                <option value="PPT">Presentation / Slides</option>
                <option value="LAB_MANUAL">Lab Manuals</option>
                <option value="SYLLABUS">Syllabus Copy</option>
                <option value="OTHER">Other Documents</option>
              </select>
            </div>

          </div>
        </div>

        {/* RESULTS SUMMARY */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>
            Showing <strong className="text-white">{materials.length}</strong> of{' '}
            <strong className="text-emerald-400">{totalCount}</strong> free study materials
          </span>
          {(university !== 'ALL' || branch !== 'ALL' || semester !== 'ALL' || materialType !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setUniversity('ALL');
                setBranch('ALL');
                setSemester('ALL');
                setMaterialType('ALL');
                setPage(1);
              }}
              className="text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* MATERIALS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-surface/50 rounded-2xl animate-pulse border border-border/40" />
            ))}
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((item) => (
              <div
                key={item._id}
                className="bg-surface border border-border/70 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-200 shadow-md group"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase border ${getBadgeStyle(
                        item.materialType
                      )}`}
                    >
                      {item.materialType === 'PYQ' ? 'Previous Year Qs' : item.materialType}
                    </span>

                    <span className="text-[11px] font-medium text-gray-400 bg-background/80 px-2.5 py-0.5 rounded border border-border/40">
                      Sem {item.semester} • {item.branch}
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-400/90 mt-1">
                      Subject: {item.subject}
                    </p>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Info Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 pt-1">
                    <span className="bg-background px-2 py-0.5 rounded border border-border/40 font-mono">
                      {item.university}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span>{formatFileSize(item.fileSize)}</span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-6 mt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="text-[11px] text-gray-500 truncate max-w-[150px]">
                    {item.fileName}
                  </div>

                  <a
                    href={`/api/study-materials/${item._id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-glow-sm transition-all duration-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Free Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface/40 rounded-2xl border border-border/60 space-y-3">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Study Materials Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              We couldn't find any study materials matching your search criteria. Try changing or clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setUniversity('ALL');
                setBranch('ALL');
                setSemester('ALL');
                setMaterialType('ALL');
                setPage(1);
              }}
              className="inline-flex items-center space-x-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-600/30 transition-colors mt-2"
            >
              <span>View All Study Materials</span>
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-3 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-surface border border-border text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-hover"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-gray-400">
              Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-surface border border-border text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-hover"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
