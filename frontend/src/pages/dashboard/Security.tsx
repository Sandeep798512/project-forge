import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export const Security: React.FC = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Account Security</h1>
        <p className="text-gray-400 text-xs mt-1">Manage password credentials and active session security.</p>
      </div>

      <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-6">
        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              maxLength={50}
              className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              maxLength={50}
              className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-glow-sm"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
