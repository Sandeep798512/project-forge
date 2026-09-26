import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Terminal, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Tag, Eye, EyeOff } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

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
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface/90 border border-border/80 p-8 rounded-2xl shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">{BRAND.name}</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight pt-2">Create Developer Account</h2>
          <p className="text-xs text-gray-400">Join to access project packages and lifetime downloads</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sandeep Gaud"
                className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
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

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                maxLength={50}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 to 50 characters"
                className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                maxLength={50}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Referral Code (Optional)</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="FORGE-XYZ123"
                className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Policy Agreement Checkbox */}
          <div className="flex items-start space-x-2 pt-1 text-xs text-gray-300">
            <input
              type="checkbox"
              id="acceptedTerms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded border-border text-primary-600 focus:ring-primary-500 bg-background"
            />
            <label htmlFor="acceptedTerms" className="leading-tight text-gray-400">
              I have read and agree to the{' '}
              <Link to="/terms" target="_blank" className="text-primary-400 hover:underline font-semibold">Terms of Service</Link>,{' '}
              <Link to="/privacy" target="_blank" className="text-primary-400 hover:underline font-semibold">Privacy Policy</Link>, and{' '}
              <Link to="/license" target="_blank" className="text-primary-400 hover:underline font-semibold">Software License Agreement</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-sm shadow-glow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
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

        <div className="text-center pt-2 border-t border-border/60 text-xs text-gray-400">
          Already have an account?{' '}
          <Link to={`/login${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-primary-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};
