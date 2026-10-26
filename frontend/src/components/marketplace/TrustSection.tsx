import React from 'react';
import { Code, FileText, Database, Layers, Monitor, Server, HelpCircle, Headphones, CheckCircle2 } from 'lucide-react';
import { ScrollReveal, ScrollStagger } from '../common/ScrollReveal';

export const TrustSection: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Complete Source Code',
      desc: 'Fully modular, clean codebases across multiple modern tech stacks & programming languages, ready for local run or deployment.',
    },
    {
      icon: FileText,
      title: 'Academic Report & PPT',
      desc: 'Comprehensive project report (.PDF) and presentation slide deck (.PPTX) formatted to university standards.',
    },
    {
      icon: Database,
      title: 'Database Schema & Seeds',
      desc: 'Exported MongoDB collections, SQL DDL scripts, and mock seed data for instant setup.',
    },
    {
      icon: Layers,
      title: 'Architecture & Flow Diagrams',
      desc: 'High-level component diagrams, ER diagrams, and sequence flows to understand system design.',
    },
    {
      icon: Monitor,
      title: 'Live Demo & Video',
      desc: 'Interactive live link and walkthrough video showing all feature workflows in action.',
    },
    {
      icon: Server,
      title: 'Deployment Guides',
      desc: 'Step-by-step instructions for hosting on Vercel, Render, Railway, AWS, or local localhost.',
    },
    {
      icon: HelpCircle,
      title: 'Viva & Interview Prep',
      desc: 'Curated list of technical viva questions, backend concepts, and architecture defense answers.',
    },
    {
      icon: Headphones,
      title: 'Direct WhatsApp Support',
      desc: 'Get technical troubleshooting assistance directly from developers when running your project.',
    },
  ];

  return (
    <section className="py-16 bg-surface/50 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-primary-400 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete Project Deliverables</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            What You Receive With Every Project Package
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            No partial code or missing source code. Everything is structured so you can run, understand, customize, and present with confidence.
          </p>
        </ScrollReveal>

        <ScrollStagger
          staggerDelay={65}
          animation="fade-up"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-surface/80 border border-border/60 rounded-2xl p-5 hover:border-primary-500/40 hover:bg-surface transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-100 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </ScrollStagger>

      </div>
    </section>
  );
};
