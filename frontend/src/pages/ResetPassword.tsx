import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { authService } from '../services/auth.service';
import { CosmicBackground } from '../components/common/CosmicBackground';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Password reset token is missing. Please click the reset link sent to your email.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please make sure both passwords are identical.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword({ token, newPassword });
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Password reset failed. The link may have expired.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired reset link. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07071a] flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* DevMate AI Particle & Glow Cosmic Canvas */}
      <CosmicBackground />

      {/* Main Glassmorphic Reset Password Card */}
      <div className="max-w-md w-full devmate-glass-card p-7 sm:p-8 rounded-[22px] relative z-10 my-auto transition-all duration-300">
        
        {/* Brand Header with DevMate Pulsing Badge */}
        <div className="text-center space-y-1 mb-5">
          <div className="w-13 h-13 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-[#5b21b6] to-[#4f46e5] flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.55)] border border-purple-400/35 transition-transform hover:scale-105 p-2">
            <img
              src="/campusget-icon-light-tile.png"
              alt={BRAND.name}
              className="w-7 h-7 rounded-lg object-contain drop-shadow"
            />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-white">Set New Password</span>
          </h1>
          <p className="text-xs text-gray-400">Choose a secure password for your {BRAND.name} account</p>

          {/* DevMate Signature Glow Dot Divider */}
          <div className="flex items-center justify-center pt-2 pb-1">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-primary-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_#8b5cf6] mx-2" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-primary-500/50" />
          </div>
        </div>

        {/* Missing Token Warning */}
        {!token && (
          <div className="p-4 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
            <p className="font-bold flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Missing Reset Token</span>
            </p>
            <p className="text-gray-300 leading-relaxed">
              This page requires a valid security token from your email. Please click the exact link sent to your email, or request a new one below:
            </p>
            <Link
              to="/forgot-password"
              className="inline-block pt-1 text-primary-400 font-bold underline hover:text-primary-300"
            >
              Go to Forgot Password Page →
            </Link>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Password Updated Successfully!</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Your password has been securely updated. You can now log in with your new credentials.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 py-3 px-8 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#6366f1] to-[#7c3aed] hover:from-[#6d28d9] hover:via-[#4f46e5] hover:to-[#8b5cf6] text-white font-semibold text-xs shadow-[0_4px_20px_rgba(99,102,241,0.45)] transition-all hover:-translate-y-0.5"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          token && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-200 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    maxLength={50}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-200 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    maxLength={50}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* DevMate AI Glowing Gradient Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#6366f1] to-[#7c3aed] hover:from-[#6d28d9] hover:via-[#4f46e5] hover:to-[#8b5cf6] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.45)] flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {loading ? <span>Updating Password...</span> : <span>Confirm & Update Password</span>}
              </button>

              <div className="text-center pt-2 border-t border-indigo-500/20">
                <Link to="/login" className="text-xs text-gray-400 hover:text-primary-300 transition-colors">
                  Back to <span className="text-primary-400 font-semibold underline">Sign In</span>
                </Link>
              </div>
            </form>
          )
        )}

      </div>
    </div>
  );
};
