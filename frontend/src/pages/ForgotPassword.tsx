import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { authService } from '../services/auth.service';
import { getDeviceId } from '../services/api';
import { CosmicBackground } from '../components/common/CosmicBackground';

const COOLDOWN_DURATION = 7 * 60; // 7 minutes in seconds

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  // Check stored cooldown for the current email
  useEffect(() => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      setCooldown(0);
      return;
    }

    const lastSentTime = localStorage.getItem(`campusget_reset_ts_${cleanEmail}`);
    if (lastSentTime) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSentTime, 10)) / 1000);
      if (elapsed < COOLDOWN_DURATION) {
        setCooldown(COOLDOWN_DURATION - elapsed);
      } else {
        setCooldown(0);
      }
    }
  }, [email]);

  // Cooldown countdown interval
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSendReset = async (targetEmail: string) => {
    const cleanEmail = targetEmail.toLowerCase().trim();
    if (!cleanEmail) return;

    setError(null);
    setLoading(true);

    try {
      const deviceId = getDeviceId();
      await authService.forgotPassword(cleanEmail, deviceId);
      setSubmitted(true);

      // Record timestamp for 7-minute cooldown
      localStorage.setItem(`campusget_reset_ts_${cleanEmail}`, Date.now().toString());
      setCooldown(COOLDOWN_DURATION);
    } catch (err: any) {
      const respData = err.response?.data;
      if (respData?.remainingSeconds) {
        setCooldown(respData.remainingSeconds);
      }
      setError(
        respData?.message ||
        'Failed to process password reset request. Please check your network and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendReset(email);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#07071a] flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* DevMate AI Particle & Glow Cosmic Canvas */}
      <CosmicBackground />

      {/* Main Glassmorphic Reset Card */}
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
            <span className="text-white">Reset Password</span>
          </h1>
          <p className="text-xs text-gray-400">Enter your registered email address to receive a secure password reset link</p>

          {/* DevMate Signature Glow Dot Divider */}
          <div className="flex items-center justify-center pt-2 pb-1">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-primary-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_#8b5cf6] mx-2" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-primary-500/50" />
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-start space-x-2.5">
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
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

            {/* Resend Cooldown Section */}
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-indigo-500/20 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-4 h-4 text-primary-400" />
                  Resend Cooldown:
                </span>
                {cooldown > 0 ? (
                  <span className="font-mono text-primary-300 font-bold bg-primary-500/15 px-2 py-0.5 rounded border border-primary-500/30">
                    {formatTime(cooldown)}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold text-[11px]">Ready to resend</span>
                )}
              </div>

              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={() => handleSendReset(email)}
                className="w-full py-2 px-3 rounded-lg bg-surface border border-indigo-500/25 hover:border-primary-500/50 hover:bg-surface-hover text-white font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                {loading
                  ? 'Resending link...'
                  : cooldown > 0
                  ? `Resend link available in ${formatTime(cooldown)}`
                  : 'Resend Reset Link'}
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setError(null);
                }}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Try another email
              </button>

              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1.5">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-indigo-500/15 p-3 text-[11px] text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-primary-400" />
                <span>Security Notice:</span>
              </div>
              <p>• Max 2 reset links per email in 24 hours.</p>
              <p>• Minimum 7-minute wait required between requests.</p>
              <p>• Max 3 distinct email requests per device/day.</p>
            </div>

            {/* DevMate AI Glowing Gradient Submit Button */}
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#6366f1] to-[#7c3aed] hover:from-[#6d28d9] hover:via-[#4f46e5] hover:to-[#8b5cf6] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.45)] flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {loading ? (
                <span>Sending link...</span>
              ) : cooldown > 0 ? (
                <span>Wait {formatTime(cooldown)} to resend</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2 border-t border-indigo-500/20">
              <Link to="/login" className="text-xs text-gray-400 hover:text-primary-300 transition-colors">
                Remember your password? <span className="text-primary-400 font-semibold underline">Sign In</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
