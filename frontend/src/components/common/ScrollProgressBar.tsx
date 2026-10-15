import React, { useState, useEffect } from 'react';

/**
 * Top Scroll Progress Bar
 * Sleek, hardware-accelerated glowing gradient indicator that tracks reading/scroll depth
 * Ultra-lightweight with requestAnimationFrame and passive listener for 120fps on PC and Mobile.
 */
export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docElement = document.documentElement;
          const body = document.body;
          const totalHeight = (docElement.scrollHeight || body.scrollHeight) - window.innerHeight;
          if (totalHeight > 0) {
            const currentScroll = window.scrollY || docElement.scrollTop || body.scrollTop || 0;
            const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
    </div>
  );
};
