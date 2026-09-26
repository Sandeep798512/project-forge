import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Tag, Copy, CheckCircle2, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const referralUrl = `${window.location.origin}/register?ref=${user?.referralCode || ''}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setDeleting(true);

    try {
      const res = await authService.deleteAccount(deletePassword || undefined);
      if (res.success) {
        logout();
        navigate('/', { replace: true });
      } else {
        setDeleteError(res.message || 'Failed to delete account.');
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Error deleting account. Please verify your password.');
    } finally {
      setDeleting(false);
    }
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
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{user?.name}</h3>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded uppercase">
              Role: {user?.role}
            </span>
          </div>
        </div>

        {/* Referral System Box */}
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

        {/* Danger Zone: Self Account Deletion */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
            <Trash2 className="w-4 h-4" />
            <span>Danger Zone: Delete Account</span>
          </div>
          <p className="text-gray-400 text-xs">
            Permanently delete your developer account and remove your personal profile from ProjectForge. This action is permanent and cannot be undone.
          </p>
          <button
            onClick={() => {
              setShowDeleteModal(true);
              setDeleteError(null);
              setDeletePassword('');
            }}
            className="px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow-sm transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Account</span>
          </button>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-red-500/30 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Account Confirmation</h3>
                <p className="text-xs text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-300">
              Are you sure you want to delete your account <strong>{user?.email}</strong>? All your profile information will be permanently removed.
            </p>

            {deleteError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                {deleteError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Enter Password to Confirm
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full bg-background border border-border/80 rounded-xl pl-3.5 pr-10 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteError(null);
                }}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-background hover:bg-surface-hover text-gray-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-glow-sm transition-all disabled:opacity-50"
              >
                {deleting ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm & Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
