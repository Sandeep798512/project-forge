import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Tag, Eye, EyeOff } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { CosmicBackground } from '../components/common/CosmicBackground';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please make sure both passwords are identical.');
      return;
    }

    if (!acceptedTerms) {
      setError('Please read and agree to the Terms of Service, Privacy Policy, and Software License Agreement.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register({ name, email, password, referralCode, acceptedTerms: true });
      if (res.success && res.token && res.user) {
        register(res.token, res.user);
        navigate(redirect);
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07071a] flex items-center justify-center py-6 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* DevMate AI Particle & Glow Cosmic Canvas */}
      <CosmicBackground />

      {/* Main Glassmorphic Register Card */}
      <div className="max-w-md w-full devmate-glass-card p-6 sm:p-7 rounded-[22px] relative z-10 my-auto transition-all duration-300">
        
        {/* Brand Header with DevMate Pulsing Badge */}
        <div className="text-center space-y-1 mb-4">
          <div className="w-13 h-13 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-[#5b21b6] to-[#4f46e5] flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.55)] border border-purple-400/35 transition-transform hover:scale-105 p-2">
            <img
              src="/campusget-icon-light-tile.png"
              alt={BRAND.name}
              className="w-7 h-7 rounded-lg object-contain drop-shadow"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="text-white">Create Account</span>
          </h1>
          <p className="text-[11px] text-gray-400">Join to access project packages and lifetime downloads</p>

          {/* DevMate Signature Glow Dot Divider */}
          <div className="flex items-center justify-center pt-2 pb-0.5">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-primary-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_#8b5cf6] mx-2" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-primary-500/50" />
          </div>
        </div>

        {error && (
          <div className="p-2.5 mb-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  maxLength={50}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ chars"
                  className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  maxLength={50}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter"
                  className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">Referral Code (Optional)</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="CAMPUS-XYZ123"
                className="w-full bg-white/[0.05] border border-indigo-500/20 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-400/80 focus:bg-indigo-500/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          {/* Policy Agreement Checkbox */}
          <div className="flex items-start space-x-2 pt-0.5 text-xs text-gray-300">
            <input
              type="checkbox"
              id="acceptedTerms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded border-purple-500/40 text-primary-600 focus:ring-primary-500 bg-white/5 accent-primary-600 cursor-pointer"
            />
            <label htmlFor="acceptedTerms" className="text-[11px] leading-snug text-gray-400 cursor-pointer select-none">
              I have read and agree to the{' '}
              <Link to="/terms" target="_blank" className="text-primary-400 hover:text-primary-300 hover:underline font-semibold">Terms of Service</Link>,{' '}
              <Link to="/privacy" target="_blank" className="text-primary-400 hover:text-primary-300 hover:underline font-semibold">Privacy Policy</Link>, and{' '}
              <Link to="/license" target="_blank" className="text-primary-400 hover:text-primary-300 hover:underline font-semibold">License</Link>.
            </label>
          </div>

          {/* DevMate AI Glowing Gradient Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#6366f1] to-[#7c3aed] hover:from-[#6d28d9] hover:via-[#4f46e5] hover:to-[#8b5cf6] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.45)] flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-1 cursor-pointer"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 mt-3 border-t border-indigo-500/20 text-xs text-gray-400">
          Already have an account?{' '}
          <Link
            to={`/login${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};
