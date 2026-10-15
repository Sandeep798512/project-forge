import React, { useRef, useEffect } from 'react';

export const HeroBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure autoplay works across all modern browsers including Safari & mobile devices
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Silent catch for browser autoplay restrictions
      });
    }
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. 3D Holographic Developer Matrix Grid Video Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-matrix-poster.jpg"
          className="w-full h-full object-cover object-center opacity-45 sm:opacity-55 mix-blend-screen scale-105 pointer-events-none transition-opacity duration-700 filter brightness-110 contrast-115"
        >
          <source src="/campusget_matrix_animated_bg.mp4" type="video/mp4" />
        </video>

        {/* Smooth Vignette Overlay to maintain contrast & high text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-background pointer-events-none" />
      </div>

      {/* 2. Ultra-Soft Ambient Gradient Blobs (22s-28s Slow Drift) */}
      <div className="absolute top-[10%] -left-[10%] w-[650px] h-[400px] rounded-full bg-gradient-to-tr from-primary-700/20 via-indigo-600/15 to-transparent blur-[140px] animate-hero-blob-1" />
      <div className="absolute top-[20%] -right-[10%] w-[550px] h-[380px] rounded-full bg-gradient-to-bl from-accent-600/20 via-cyan-600/10 to-transparent blur-[130px] animate-hero-blob-2" />
      <div className="absolute -bottom-[20%] left-[25%] w-[500px] h-[300px] rounded-full bg-gradient-to-t from-purple-700/15 via-primary-600/10 to-transparent blur-[120px] animate-hero-blob-3" />

      {/* 3. Faint AI / Data Network SVG (Drifting peripheral nodes & thin connecting lines) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25 md:opacity-40 animate-hero-network-drift">
        <svg
          className="w-full h-full max-w-7xl mx-auto"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Left Peripheral Network Lines & Nodes */}
          <path d="M 80 120 L 220 200 L 150 340 L 60 280 Z" stroke="url(#lineGrad1)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 220 200 L 340 140 M 150 340 L 280 420" stroke="url(#lineGrad1)" strokeWidth="1" />
          
          <circle cx="80" cy="120" r="3" fill="#818CF8" fillOpacity="0.4" className="animate-hero-pulse-slow" />
          <circle cx="220" cy="200" r="4" fill="#C084FC" fillOpacity="0.5" className="animate-hero-pulse-fast" />
          <circle cx="150" cy="340" r="3" fill="#38BDF8" fillOpacity="0.3" />
          <circle cx="340" cy="140" r="2.5" fill="#818CF8" fillOpacity="0.3" />
          <circle cx="280" cy="420" r="3.5" fill="#C084FC" fillOpacity="0.4" className="animate-hero-pulse-slow" />

          {/* Right Peripheral Network Lines & Nodes */}
          <path d="M 1120 140 L 980 220 L 1040 360 L 1140 300 Z" stroke="url(#lineGrad2)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 980 220 L 860 160 M 1040 360 L 920 440" stroke="url(#lineGrad2)" strokeWidth="1" />

          <circle cx="1120" cy="140" r="3" fill="#38BDF8" fillOpacity="0.4" />
          <circle cx="980" cy="220" r="4" fill="#818CF8" fillOpacity="0.5" className="animate-hero-pulse-slow" />
          <circle cx="1040" cy="360" r="3" fill="#C084FC" fillOpacity="0.3" className="animate-hero-pulse-fast" />
          <circle cx="860" cy="160" r="2.5" fill="#38BDF8" fillOpacity="0.3" />
          <circle cx="920" cy="440" r="3.5" fill="#818CF8" fillOpacity="0.4" />

          {/* Faint Connecting Arcs (Bypassing Central Text Area) */}
          <path d="M 220 200 Q 600 40 980 220" stroke="url(#lineGrad1)" strokeWidth="0.8" strokeOpacity="0.1" />
          <path d="M 150 340 Q 600 520 1040 360" stroke="url(#lineGrad2)" strokeWidth="0.8" strokeOpacity="0.08" />
        </svg>
      </div>

      {/* 4. Tiny Ambient Floating Particles */}
      <div className="absolute inset-0 opacity-40 md:opacity-60">
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-indigo-400/40 animate-hero-particle-1" />
        <div className="absolute top-[65%] left-[8%] w-1 h-1 rounded-full bg-purple-400/30 animate-hero-particle-2" />
        <div className="absolute top-[30%] right-[18%] w-1.5 h-1.5 rounded-full bg-sky-400/40 animate-hero-particle-3" />
        <div className="absolute top-[75%] right-[12%] w-1 h-1 rounded-full bg-indigo-400/30 animate-hero-particle-1" />
        <div className="absolute top-[12%] right-[35%] w-1 h-1 rounded-full bg-purple-400/25 animate-hero-particle-2" />
      </div>
    </div>
  );
};
