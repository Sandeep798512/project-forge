import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { authService } from '../services/auth.service';

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
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-surface/90 border border-border/80 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img
              src="/campusget-icon-light-tile.png"
              alt={BRAND.name}
              className="w-10 h-10 rounded-xl object-contain shadow-glow-sm"
            />
            <span className="font-extrabold text-2xl text-white">{BRAND.name}</span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">Set New Password</h2>
          <p className="text-xs text-gray-400">Choose a secure password for your CampusGet account</p>
        </div>

        {/* Missing Token Warning */}
        {!token && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
            <p className="font-bold flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Missing Reset Token</span>
            </p>
            <p className="text-gray-300 leading-relaxed">
              This page requires a valid security token from your email. Please click the exact link sent to your email, or request a new one below:
            </p>
            <Link
              to="/forgot-password"
              className="inline-block pt-1 text-emerald-400 font-bold underline hover:text-emerald-300"
            >
              Go to Forgot Password Page →
            </Link>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
              className="inline-flex items-center space-x-2 py-3 px-8 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-glow-sm transition-all"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          token && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    maxLength={50}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    maxLength={50}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-glow-sm disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <span>Updating Password...</span> : <span>Confirm & Update Password</span>}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-gray-400 hover:text-primary-400 transition-colors">
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
