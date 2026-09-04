import React from 'react';
import { BRAND } from '../config/brand.config';

export const Privacy: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Last updated: August 31, 2026</p>

        <div className="bg-surface/60 p-6 rounded-2xl border border-border/60 space-y-4">
          <h2 className="text-lg font-bold text-white">Information We Collect</h2>
          <p>We collect essential information required to fulfill orders and provide technical support: Name, Email Address, Account credentials (hashed), Order history, and IP logs for download authorization security.</p>
          <h2 className="text-lg font-bold text-white">Payment Security</h2>
          <p>We do not store your raw credit card or bank credentials. Payment processing is handled securely by Razorpay using bank-grade encryption.</p>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicy: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-extrabold text-white">Refund & Download Policy</h1>
        <p className="text-xs text-gray-400">Last updated: August 31, 2026</p>

        <div className="bg-surface/60 p-6 rounded-2xl border border-border/60 space-y-4">
          <h2 className="text-lg font-bold text-white">Digital Product Nature</h2>
          <p>Because our software packages contain non-tangible digital source code, downloads are fulfilled immediately after payment verification.</p>
          <h2 className="text-lg font-bold text-white">Eligible Refund Scenarios</h2>
          <p>Refunds are granted if: (1) Duplicate payments occur due to gateway glitches, or (2) The source code archive is corrupt.</p>
        </div>
      </div>
    </div>
  );
};

export const License: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-extrabold text-white">Software License Agreement</h1>
        <p className="text-xs text-gray-400">Last updated: August 31, 2026</p>

        <div className="bg-surface/60 p-6 rounded-2xl border border-border/60 space-y-4">
          <h2 className="text-lg font-bold text-white">Single-Developer License</h2>
          <p>Each package purchase grants a Single-Developer License for personal educational use, customization, learning, and portfolio demonstration.</p>
        </div>
      </div>
    </div>
  );
};
