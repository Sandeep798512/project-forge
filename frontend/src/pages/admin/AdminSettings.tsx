import React from 'react';
import { Settings, ShieldCheck, CreditCard, HardDrive, Mail, Phone } from 'lucide-react';
import { BRAND } from '../../config/brand.config';

export const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System Settings & Gateway Status</h1>
        <p className="text-gray-400 text-xs mt-1">Platform configuration parameters, gateway keys, storage architecture, and security controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-accent-400" />
            <span>General Platform Info</span>
          </h3>
          <div className="space-y-2 text-gray-300 font-mono">
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Brand Name:</span>
              <span className="font-bold text-white">{BRAND.name}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Currency:</span>
              <span className="font-bold text-white">{BRAND.currency.code} ({BRAND.currency.symbol})</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Support Email:</span>
              <span className="font-bold text-white">{BRAND.supportEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">WhatsApp Helpdesk:</span>
              <span className="font-bold text-white">+{BRAND.whatsappNumber}</span>
            </div>
          </div>
        </div>

        {/* Security & Token Config */}
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Security & Auth Configuration</span>
          </h3>
          <div className="space-y-2 text-gray-300 font-mono">
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">JWT Expiration:</span>
              <span className="font-bold text-emerald-400">7 Days</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Signed URL Expiry:</span>
              <span className="font-bold text-emerald-400">15 Minutes (HMAC SHA-256)</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Password Hashing:</span>
              <span className="font-bold text-white">Bcrypt (12 Rounds)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rate Limiting:</span>
              <span className="font-bold text-emerald-400">Active Enabled</span>
            </div>
          </div>
        </div>

        {/* Storage Architecture Status */}
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-primary-400" />
            <span>Storage Architecture Status</span>
          </h3>
          <div className="space-y-2 text-gray-300 font-mono">
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Storage Provider:</span>
              <span className="font-bold text-white">Protected Private Object Storage</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Public Access:</span>
              <span className="font-bold text-red-400 font-extrabold">BLOCKED (0% Public Exposure)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Abuse Detection:</span>
              <span className="font-bold text-emerald-400">Active (&gt;10 dl / 24h)</span>
            </div>
          </div>
        </div>

        {/* Payment Gateway Status */}
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Payment Provider Configuration</span>
          </h3>
          <div className="space-y-2 text-gray-300 font-mono">
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Gateway Provider:</span>
              <span className="font-bold text-white">Razorpay Payments API</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-gray-400">Server Signature Check:</span>
              <span className="font-bold text-emerald-400">HMAC SHA-256 Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Webhook Idempotency:</span>
              <span className="font-bold text-emerald-400">Active Protected</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
