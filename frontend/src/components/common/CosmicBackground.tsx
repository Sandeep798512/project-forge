import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundProps {
  particleCount?: number;
  className?: string;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  particleCount = 75,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 640 ? Math.floor(particleCount * 0.5) : particleCount;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          a: Math.random() * 0.6 + 0.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.a})`;
        ctx.fill();
      }

      // Connect nearby particles with subtle constellation lines
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = 0.14 * (1 - dist / maxDistance);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [particleCount]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* DevMate AI Particle Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Center Ambient Pulsing Glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(124, 58, 237, 0.08) 45%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'devmateBgGlow 8s ease-in-out infinite',
        }}
      />

      {/* Floating Glowing Orbs (Exact DevMate AI positions & colors) */}
      <div
        className="absolute w-[450px] sm:w-[520px] h-[450px] sm:h-[520px] rounded-full pointer-events-none -top-[120px] left-1/2 -translate-x-1/2"
        style={{
          background: '#5b21b6',
          filter: 'blur(95px)',
          opacity: 0.22,
          animation: 'devmateOrbFloat 12s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] rounded-full pointer-events-none -bottom-[80px] left-[5%]"
        style={{
          background: '#4f46e5',
          filter: 'blur(85px)',
          opacity: 0.2,
          animation: 'devmateOrbFloat 9s ease-in-out infinite -3s',
        }}
      />
      <div
        className="absolute w-[280px] sm:w-[340px] h-[280px] sm:h-[340px] rounded-full pointer-events-none bottom-[12%] right-[5%]"
        style={{
          background: '#7c3aed',
          filter: 'blur(85px)',
          opacity: 0.2,
          animation: 'devmateOrbFloat 11s ease-in-out infinite -6s',
        }}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 devmate-bg-grid opacity-40 pointer-events-none" />
    </div>
  );
};
