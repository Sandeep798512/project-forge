import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, BookOpen, Sparkles } from 'lucide-react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Initialize PDF.js worker using Vite asset URL with CDN fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface PdfThumbnailProps {
  fileUrl: string;
  thumbnailUrl?: string;
  thumbnailBase64?: string;
  title: string;
  subject?: string;
  materialType?: string;
  className?: string;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  fileUrl,
  thumbnailUrl,
  thumbnailBase64,
  title,
  subject,
  materialType = 'NOTES',
  className = '',
}) => {
  const [thumbSrc, setThumbSrc] = useState<string | null>(thumbnailUrl || thumbnailBase64 || null);
  const [loading, setLoading] = useState<boolean>(!thumbnailUrl && !thumbnailBase64);
  const [error, setError] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;

    // 1. If explicit thumbnail is provided, use immediately
    if (thumbnailUrl || thumbnailBase64) {
      setThumbSrc(thumbnailUrl || thumbnailBase64 || null);
      setLoading(false);
      return;
    }

    // 2. Check browser session cache
    const cacheKey = `cg_pdf_thumb_${fileUrl}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setThumbSrc(cached);
      setLoading(false);
      return;
    }

    // 3. Render 1st page using PDF.js
    let cancel = false;
    const renderPdfFirstPage = async () => {
      try {
        setLoading(true);
        setError(false);

        const loadingTask = pdfjsLib.getDocument({
          url: fileUrl,
          withCredentials: false,
          disableRange: false,
          disableStream: false,
        });

        const pdf = await loadingTask.promise;
        if (cancel || !isMounted.current) return;

        const page = await pdf.getPage(1);
        if (cancel || !isMounted.current) return;

        // Render at a clear crisp thumbnail resolution
        const unscaledViewport = page.getViewport({ scale: 1 });
        const targetWidth = 360;
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (!context) {
          setError(true);
          setLoading(false);
          return;
        }

        // Render white background first (so transparent PDFs look like real paper)
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext as any).promise;
        if (cancel || !isMounted.current) return;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        // Save to cache
        try {
          sessionStorage.setItem(cacheKey, dataUrl);
        } catch {
          // If storage full, ignore
        }

        if (isMounted.current) {
          setThumbSrc(dataUrl);
          setLoading(false);
        }
      } catch (err) {
        if (!cancel && isMounted.current) {
          console.warn('[PDF THUMBNAIL PREVIEW]', err);
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPdfFirstPage();

    return () => {
      cancel = true;
      isMounted.current = false;
    };
  }, [fileUrl, thumbnailUrl, thumbnailBase64]);

  // If thumbnail loaded successfully
  if (thumbSrc && !error) {
    return (
      <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
        <img
          src={thumbSrc}
          alt={`Preview of ${title}`}
          className="w-full h-full object-cover object-top filter brightness-95 group-hover:brightness-105 group-hover:scale-105 transition-all duration-300"
          loading="lazy"
        />
        {/* Subtle paper depth shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30 pointer-events-none" />
      </div>
    );
  }

  // Loading skeleton with shimmering notebook illustration
  if (loading) {
    return (
      <div className={`relative overflow-hidden bg-slate-900/90 border-b border-border/40 flex flex-col items-center justify-center p-4 ${className}`}>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse mb-2">
          <BookOpen className="w-5 h-5" />
        </div>
        <p className="text-[11px] text-gray-400 font-medium animate-pulse">Rendering 1st page...</p>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
    );
  }

  // Fallback: Modern Academic Document Cover
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-b border-border/40 flex flex-col justify-between p-4 ${className}`}>
      {/* Top banner */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
          {materialType}
        </span>
        <FileText className="w-4 h-4 text-gray-500" />
      </div>

      {/* Center Document Lines & Title Preview */}
      <div className="my-auto py-2 space-y-1.5 text-center">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-1.5">
          <BookOpen className="w-4 h-4" />
        </div>
        <p className="text-xs font-bold text-gray-200 line-clamp-2 px-2 leading-tight">
          {subject || title}
        </p>
        <p className="text-[10px] text-emerald-400 font-medium">CampusGet Academic Notes</p>
      </div>

      {/* Bottom watermark */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Page 1 Preview</span>
        </span>
        <span className="font-mono">PDF</span>
      </div>
    </div>
  );
};
