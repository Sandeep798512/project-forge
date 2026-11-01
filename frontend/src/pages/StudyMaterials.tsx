import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  GraduationCap,
  Sparkles,
  Filter,
  Calendar,
  CheckCircle,
  FileSpreadsheet,
  FileCode,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from 'lucide-react';
import api, { getBaseURL } from '../services/api';
import { PdfThumbnail } from '../components/common/PdfThumbnail';
import { ScrollReveal, ScrollStagger } from '../components/common/ScrollReveal';
import { INITIAL_STUDY_MATERIALS } from '../data/initialMarketplaceData';
import { SEOHead } from '../components/common/SEOHead';

export interface StudyMaterialItem {
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
  fileSize: number;
  mimeType?: string;
  thumbnailUrl?: string;
  thumbnailBase64?: string;
  isPublished: boolean;
  createdAt: string;
}

const getOrCreateDeviceId = (): string => {
  try {
    let id = localStorage.getItem('cg_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('cg_device_id', id);
    }
    return id;
  } catch {
    return 'browser_device';
  }
};

export const StudyMaterials: React.FC = () => {
  // Instant pre-loaded study materials for 0ms initial render (no cold-start waiting)
  const getInitialMaterials = (): StudyMaterialItem[] => {
    try {
      const cached = localStorage.getItem('cg_cached_study_materials');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_STUDY_MATERIALS as StudyMaterialItem[];
  };

  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [materials, setMaterials] = useState<StudyMaterialItem[]>(getInitialMaterials);
  const [selectedItem, setSelectedItem] = useState<StudyMaterialItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(urlSearch);
  const [university, setUniversity] = useState<string>('ALL');
  const [branch, setBranch] = useState<string>('ALL');
  const [year, setYear] = useState<string>('ALL');
  const [semester, setSemester] = useState<string>('ALL');
  const [materialType, setMaterialType] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(INITIAL_STUDY_MATERIALS.length);

  useEffect(() => {
    if (urlSearch && urlSearch !== search) {
      setSearch(urlSearch);
      setPage(1);
    }
  }, [urlSearch]);

  const fetchMaterials = async () => {
    try {
      const isDefault = !search.trim() && university === 'ALL' && branch === 'ALL' && year === 'ALL' && semester === 'ALL' && materialType === 'ALL' && page === 1;
      if (!isDefault) {
        setLoading(true);
      }
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (university !== 'ALL') params.append('university', university);
      if (branch !== 'ALL') params.append('branch', branch);
      if (year !== 'ALL') params.append('year', year);
      if (semester !== 'ALL') params.append('semester', semester);
      if (materialType !== 'ALL') params.append('materialType', materialType);
      params.append('page', String(page));
      params.append('limit', '16');

      const res = await api.get(`/study-materials?${params.toString()}`);
      if (res.data.success) {
        setMaterials(res.data.materials);
        setTotalPages(res.data.pagination.pages || 1);
        setTotalCount(res.data.pagination.total || 0);
        if (isDefault) {
          localStorage.setItem('cg_cached_study_materials', JSON.stringify(res.data.materials));
        }
      }
    } catch (error) {
      console.error('Failed to load study materials', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [page, university, branch, year, semester, materialType]);

  // Lock body scroll and handle Escape key when popup preview is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

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
      <SEOHead
        title="Free B.Tech CSE Notes & University PYQs (AKTU, VTU) | CampusGet"
        description="Download free engineering lecture notes, AKTU & university previous year question papers (PYQs), lab manuals, and syllabus for CSE/IT students. Instant 1-click PDF download."
        keywords="engineering notes pdf, free btech cse notes, aktu previous year question papers, aktu pyqs, vtu cse notes, data structures notes, dbms pdf notes, university exam papers free download"
        canonicalPath="/study-materials"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HERO HEADER */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4">
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
        </ScrollReveal>

        {/* ── 2 BIG PRIMARY ACTION BUTTONS (ALL NOTES vs PYQs) ── */}
        <ScrollReveal animation="fade-up" delay={60} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-1.5 rounded-2xl bg-surface/80 border border-border/80 backdrop-blur-md shadow-xl">
            
            {/* BUTTON 1: ALL NOTES */}
            <button
              type="button"
              onClick={() => {
                setMaterialType(materialType === 'NOTES' ? 'ALL' : 'NOTES');
                setPage(1);
              }}
              className={`group relative overflow-hidden rounded-xl p-4 sm:p-5 text-left transition-all duration-300 cursor-pointer border ${
                materialType === 'NOTES'
                  ? 'bg-gradient-to-br from-emerald-600/35 via-emerald-600/20 to-teal-900/30 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/50 scale-[1.01]'
                  : 'bg-background/90 hover:bg-surface border-border/70 hover:border-emerald-500/50 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    materialType === 'NOTES'
                      ? 'bg-emerald-500 text-white shadow-glow-sm'
                      : 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                  }`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <span>All Notes</span>
                      {materialType === 'NOTES' ? (
                        <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full">
                          Free PDFs
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-0.5">
                      Handwritten & Unit-wise Lecture Notes
                    </p>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  materialType === 'NOTES'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/5 text-gray-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300'
                }`}>
                  →
                </div>
              </div>
            </button>

            {/* BUTTON 2: PYQs */}
            <button
              type="button"
              onClick={() => {
                setMaterialType(materialType === 'PYQ' ? 'ALL' : 'PYQ');
                setPage(1);
              }}
              className={`group relative overflow-hidden rounded-xl p-4 sm:p-5 text-left transition-all duration-300 cursor-pointer border ${
                materialType === 'PYQ'
                  ? 'bg-gradient-to-br from-purple-600/35 via-indigo-600/20 to-purple-950/30 border-purple-500 shadow-[0_0_25px_rgba(147,51,234,0.35)] ring-2 ring-purple-500/50 scale-[1.01]'
                  : 'bg-background/90 hover:bg-surface border-border/70 hover:border-purple-500/50 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    materialType === 'PYQ'
                      ? 'bg-purple-600 text-white shadow-glow-sm'
                      : 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white'
                  }`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <span>PYQs</span>
                      {materialType === 'PYQ' ? (
                        <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold px-2 py-0.5 rounded-full">
                          University Papers
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-0.5">
                      Previous Year Exam Papers & Solved Sets
                    </p>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  materialType === 'PYQ'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-300'
                }`}>
                  →
                </div>
              </div>
            </button>

          </div>

          {/* Active Filter Clear Helper */}
          {materialType !== 'ALL' && (
            <div className="flex items-center justify-center mt-3">
              <button
                type="button"
                onClick={() => {
                  setMaterialType('ALL');
                  setPage(1);
                }}
                className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 bg-surface/90 px-3.5 py-1.5 rounded-full border border-border/80 hover:border-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
                <span>Viewing <strong>{materialType === 'NOTES' ? 'Lecture Notes' : 'PYQs'}</strong> only — <span className="text-emerald-400 font-semibold hover:underline">Click to Show All Resources</span></span>
              </button>
            </div>
          )}
        </ScrollReveal>

        {/* SEARCH & FILTERS BAR */}
        <ScrollReveal animation="fade-up" delay={80} className="bg-surface border border-border/80 rounded-2xl p-5 shadow-xl space-y-4">
          
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            
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

            {/* Year */}
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Year</span>
              </label>
              <select
                value={year}
                onChange={(e) => { setYear(e.target.value); setPage(1); }}
                className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Years</option>
                <option value="1">1st Year (Sem 1 & 2)</option>
                <option value="2">2nd Year (Sem 3 & 4)</option>
                <option value="3">3rd Year (Sem 5 & 6)</option>
                <option value="4">4th Year (Sem 7 & 8)</option>
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
        </ScrollReveal>

        {/* RESULTS SUMMARY */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>
            Showing <strong className="text-white">{materials.length}</strong> of{' '}
            <strong className="text-emerald-400">{totalCount}</strong> free study materials
          </span>
          {(university !== 'ALL' || branch !== 'ALL' || year !== 'ALL' || semester !== 'ALL' || materialType !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setUniversity('ALL');
                setBranch('ALL');
                setYear('ALL');
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 sm:h-72 bg-surface/50 rounded-xl sm:rounded-2xl animate-pulse border border-border/40" />
            ))}
          </div>
        ) : materials.length > 0 ? (
          <ScrollStagger
            staggerDelay={40}
            animation="fade-up"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
          >
            {materials.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="bg-surface border border-border/70 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-200 group cursor-pointer"
              >
                {/* Compact 1st Page Thumbnail Preview Banner */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full bg-slate-900 border-b border-border/50 overflow-hidden">
                  <PdfThumbnail
                    fileUrl={`${getBaseURL()}/study-materials/${item._id}/preview`}
                    thumbnailUrl={item.thumbnailUrl}
                    thumbnailBase64={item.thumbnailBase64}
                    title={item.title}
                    subject={item.subject}
                    materialType={item.materialType}
                    className="w-full h-full"
                  />
                  {/* Type badge overlay on thumbnail */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm uppercase border backdrop-blur-md ${getBadgeStyle(
                        item.materialType
                      )}`}
                    >
                      {item.materialType === 'PYQ' ? 'PYQ' : item.materialType}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-emerald-400 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 shadow-lg backdrop-blur-sm">
                      <Eye className="w-3 h-3" /> Click to View
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1.5">
                    {/* Branch & Semester */}
                    <div className="flex items-center justify-between gap-1 text-[10px] text-gray-400">
                      <span className="bg-background/80 px-1.5 py-0.5 rounded border border-border/40 font-mono truncate max-w-[110px]">
                        {item.branch}
                      </span>
                      <span className="font-medium text-gray-400 shrink-0">
                        {item.semester ? `Sem ${item.semester}` : ''}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Subject */}
                    <p className="text-[11px] text-emerald-400/90 font-medium truncate">
                      {item.subject}
                    </p>

                    {/* University & File Size */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-border/30">
                      <span className="truncate max-w-[90px] text-gray-400">{item.university}</span>
                      <span className="font-mono text-gray-400 shrink-0">{formatFileSize(item.fileSize)}</span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="w-full inline-flex items-center justify-center space-x-1.5 bg-emerald-600/15 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500 text-xs font-semibold py-1.5 px-2 rounded-lg transition-all duration-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </ScrollStagger>
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

        {/* ENLARGED PREVIEW & DOWNLOAD MODAL */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${getBadgeStyle(
                      selectedItem.materialType
                    )}`}
                  >
                    {selectedItem.materialType === 'PYQ' ? 'Previous Year Qs' : selectedItem.materialType}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedItem.subject}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="overflow-y-auto flex-1 p-5 space-y-4">
                {/* Large Thumbnail / Document Preview */}
                <div className="relative aspect-[16/10] max-h-[300px] w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
                  <PdfThumbnail
                    fileUrl={`${getBaseURL()}/study-materials/${selectedItem._id}/preview`}
                    thumbnailUrl={selectedItem.thumbnailUrl}
                    thumbnailBase64={selectedItem.thumbnailBase64}
                    title={selectedItem.title}
                    subject={selectedItem.subject}
                    materialType={selectedItem.materialType}
                    className="w-full h-full"
                  />
                </div>

                {/* Title & Info */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {selectedItem.title}
                  </h2>
                  {selectedItem.description && (
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                      {selectedItem.description}
                    </p>
                  )}
                </div>

                {/* Metadata Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-gray-400 block uppercase">University</span>
                    <span className="font-semibold text-white truncate block">{selectedItem.university}</span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-gray-400 block uppercase">Branch</span>
                    <span className="font-semibold text-white truncate block">{selectedItem.branch}</span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-gray-400 block uppercase">Semester / Year</span>
                    <span className="font-semibold text-white truncate block">
                      Sem {selectedItem.semester} {selectedItem.year ? `(${selectedItem.year}th Yr)` : ''}
                    </span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-gray-400 block uppercase">File Size</span>
                    <span className="font-semibold text-emerald-400 truncate block">
                      {formatFileSize(selectedItem.fileSize)}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 flex items-center justify-between px-1">
                  <span className="truncate max-w-[260px]">File: {selectedItem.fileName}</span>
                  <span>Added: {new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
                <a
                  href={`${getBaseURL()}/study-materials/${selectedItem._id}/preview`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full PDF</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-transparent hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>

                  <a
                    href={`${getBaseURL()}/study-materials/${selectedItem._id}/download?deviceId=${getOrCreateDeviceId()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-glow transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF (Free)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
