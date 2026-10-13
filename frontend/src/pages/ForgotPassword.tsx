import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { authService } from '../services/auth.service';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetTokenInfo, setResetTokenInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSubmitted(true);
      if (res.resetToken) {
        setResetTokenInfo(res.resetToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process password reset request. Please check your network and try again.');
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
          <h2 className="text-xl font-bold text-white pt-2">Reset Password</h2>
          <p className="text-xs text-gray-400">Enter your registered email address to receive a secure password reset link</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-white">Check Your Email Inbox</p>
                <p className="text-gray-300 leading-relaxed">
                  If an account exists with <strong className="text-white">{email}</strong>, we have sent a secure password reset link.
                </p>
                <p className="text-gray-400 text-[11px] pt-1">
                  ⏱️ The link will expire in <strong>30 minutes</strong>. If you do not see the email, please check your Spam or Junk folder.
                </p>
              </div>
            </div>

            {resetTokenInfo && (
              <div className="p-3.5 bg-background border border-emerald-500/30 rounded-xl font-mono text-xs text-gray-300 space-y-1">
                <span className="text-emerald-400 block text-[10px] font-bold">LOCAL DEV PREVIEW LINK:</span>
                <Link to={`/reset-password?token=${resetTokenInfo}`} className="text-primary-400 underline font-bold break-all block">
                  Click here to Reset Password
                </Link>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setResetTokenInfo(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Try another email
              </button>

              <Link to="/login" className="text-primary-400 font-semibold hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-glow-sm disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-gray-400 hover:text-primary-400 transition-colors">
                Remember your password? <span className="text-primary-400 font-semibold underline">Sign In</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
