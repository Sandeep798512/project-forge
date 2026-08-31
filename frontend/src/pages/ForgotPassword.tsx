import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { authService } from '../services/auth.service';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetTokenInfo, setResetTokenInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSubmitted(true);
      if (res.resetToken) {
        setResetTokenInfo(res.resetToken);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-surface/90 border border-border/80 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl text-white">{BRAND.name}</span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">Reset Password</h2>
          <p className="text-xs text-gray-400">Enter your email address to receive password reset instructions</p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Reset Request Issued!</p>
                <p className="mt-1 text-gray-300">If that email exists in our records, a reset token has been issued.</p>
              </div>
            </div>

            {resetTokenInfo && (
              <div className="p-3 bg-background border border-border rounded-xl font-mono text-xs text-gray-300">
                <span className="text-gray-500 block text-[10px]">DEV TOKEN PREVIEW:</span>
                <Link to={`/reset-password?token=${resetTokenInfo}`} className="text-primary-400 underline font-bold break-all">
                  Click here to Reset Password
                </Link>
              </div>
            )}

            <Link to="/login" className="block text-center text-xs text-primary-400 font-semibold hover:underline">
              Back to Sign In
            </Link>
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
                  className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-glow-sm"
            >
              Send Reset Link
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
