import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { CosmicBackground } from '../components/common/CosmicBackground';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        navigate(redirect);
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07071a] flex items-center justify-center py-8 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* DevMate AI Particle & Glow Cosmic Canvas */}
      <CosmicBackground />

      {/* Main Glassmorphic Login Card */}
      <div className="max-w-md w-full devmate-glass-card p-7 sm:p-8 rounded-[22px] relative z-10 my-auto transition-all duration-300">
        
        {/* Brand Header with DevMate Pulsing Badge */}
        <div className="text-center space-y-1 mb-5">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#5b21b6] to-[#4f46e5] flex items-center justify-center shadow-[0_0_28px_rgba(99,102,241,0.55)] border border-purple-400/35 transition-transform hover:scale-105">
            <img
              src="/campusget-icon-light-tile.png"
              alt={BRAND.name}
              className="w-8 h-8 rounded-lg object-contain drop-shadow"
            />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-white">{BRAND.name}</span>{' '}
            <span className="text-primary-400">Portal</span>
          </h1>
          <p className="text-xs text-gray-400">Sign in to access your projects and downloads</p>

          {/* DevMate Signature Glow Dot Divider */}
          <div className="flex items-center justify-center pt-2 pb-1">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-primary-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_#8b5cf6] mx-2" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-primary-500/50" />
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex flex-col space-y-1.5">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
            {error.toLowerCase().includes('lock') && (
              <div className="pt-1 pl-6">
                <Link to="/forgot-password" className="text-primary-400 hover:underline font-semibold text-[11px] inline-flex items-center gap-1">
                  Forgot password? Reset it here →
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1.5">Email Address</label>
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

          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                maxLength={50}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-purple-500/40 bg-white/5 text-primary-600 focus:ring-primary-500/30 accent-primary-600 cursor-pointer"
              />
              <span className="group-hover:text-white transition-colors">Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* DevMate AI Glowing Gradient Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#6366f1] to-[#7c3aed] hover:from-[#6d28d9] hover:via-[#4f46e5] hover:to-[#8b5cf6] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.45)] flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-indigo-500/20" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0e0926]/90 px-3 text-gray-400 tracking-wider font-medium">OR</span>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <Link
            to={`/register${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
          >
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};
