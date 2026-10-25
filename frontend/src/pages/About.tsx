import React from 'react';
import { Terminal, Shield, Code, Sparkles, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { SEOHead } from '../components/common/SEOHead';

export const About: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <SEOHead
        title="About CampusGet | Engineering Projects, Source Code & Prep Ecosystem"
        description="Learn about CampusGet - the premier engineering project marketplace and study hub built to empower students with production-grade full-stack source code, documentation, and viva prep."
        keywords="about campusget, engineering project ecosystem, computer science projects, student developer marketplace"
        canonicalPath="/about"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-primary-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empowering Developer Education</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About {BRAND.name}
          </h1>
          <p className="text-gray-300 text-base max-w-2xl mx-auto">
            {BRAND.supportingText}
          </p>
        </div>

        {/* Positioning Banner */}
        <div className="bg-surface/80 border border-border/80 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary-400" />
            <span>Our Engineering Philosophy</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {BRAND.name} is built around a clear standard: <strong>"Build, understand, customize and showcase real-world projects."</strong>
          </p>
          <p className="text-gray-400 text-xs leading-relaxed">
            We do not sell cheap shortcuts or fake academic guarantees. Every project package in our marketplace is designed like an actual industry SaaS product with clean modular code, architectural documentation, database seeds, and technical support so you can present and defend your work with absolute confidence.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface/60 border border-border/60 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-bold text-white text-base">Production Code Quality</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Clean TypeScript, React, Express, and MongoDB patterns structured according to real software engineering practices.
            </p>
          </div>

          <div className="bg-surface/60 border border-border/60 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-bold text-white text-base">360° Academic Materials</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              From IEEE-format project reports and presentation decks to viva questions and system architecture diagrams.
            </p>
          </div>

          <div className="bg-surface/60 border border-border/60 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-bold text-white text-base">Developer-First Support</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Direct access to technical developers on WhatsApp and ticket helpdesk for environment configuration guidance.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
