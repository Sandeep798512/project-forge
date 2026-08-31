import React from 'react';
import { BRAND } from '../config/brand.config';

export const Terms: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-gray-400">Last updated: August 31, 2026</p>

        <section className="space-y-3 bg-surface/60 p-6 rounded-2xl border border-border/60">
          <h2 className="text-lg font-bold text-white">1. Platform Scope & Purpose</h2>
          <p>
            {BRAND.name} provides digital software packages, source code, documentation, and technical developer materials intended for software engineering education, learning, customization, and portfolio demonstration.
          </p>
          <p>
            We do not endorse or advertise academic cheating, plagiarism, guaranteed exam outcomes, or fraudulent submissions. Customers are expected to understand, adapt, and build upon the purchased software code.
          </p>
        </section>

        <section className="space-y-3 bg-surface/60 p-6 rounded-2xl border border-border/60">
          <h2 className="text-lg font-bold text-white">2. License Grant</h2>
          <p>
            Upon purchasing a project package, {BRAND.name} grants you a non-exclusive, non-transferable license to modify, run, customize, and showcase the source code for personal, educational, and portfolio purposes.
          </p>
          <p className="text-red-400 font-semibold">
            Strictly Prohibited: Reselling, re-distributing publicly on marketplace sites, or claiming original authorship for raw unmodified project zip packages is forbidden.
          </p>
        </section>

        <section className="space-y-3 bg-surface/60 p-6 rounded-2xl border border-border/60">
          <h2 className="text-lg font-bold text-white">3. Digital Deliveries & Downloads</h2>
          <p>
            All purchases provide instant access through your authenticated account dashboard. Download links are securely authenticated and time-limited to prevent unauthorized link sharing.
          </p>
        </section>
      </div>
    </div>
  );
};
