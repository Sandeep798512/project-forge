import React, { useState } from 'react';
import { User, Mail, Tag, Copy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralUrl = `${window.location.origin}/register?ref=${user?.referralCode || ''}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Account Profile</h1>
        <p className="text-gray-400 text-xs mt-1">Manage your developer profile details and referral code.</p>
      </div>

      <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-border/60">
          <div className="w-16 h-16 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-300 font-extrabold text-xl">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{user?.name}</h3>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded uppercase">
              Role: {user?.role}
            </span>
          </div>
        </div>

        {/* Referral System Box (Master Requirement #30) */}
        <div className="bg-background/80 border border-border/60 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-primary-400 font-bold text-sm">
            <Tag className="w-4 h-4" />
            <span>Your Developer Referral Link</span>
          </div>
          <p className="text-gray-400 text-xs">
            Share your unique referral link with classmates. Earn rewards when developers register using your code.
          </p>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 bg-surface border border-border/80 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-300"
            />
            <button
              onClick={copyReferral}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow-sm"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
