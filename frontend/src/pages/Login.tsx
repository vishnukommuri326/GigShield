// frontend/src/pages/Login.tsx 

import { useState } from 'react';
import { Mail, Lock, Shield, ArrowRight, AlertCircle, Send } from 'lucide-react';
import { login } from '../services/authService'; 

interface LoginProps {
  onNavigate: (page: string) => void;
  onLogin: (email: string) => void;
}

const Login = ({ onNavigate, onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // CHANGED: Now uses real Firebase auth
    try {
      const user = await login({ email, password, rememberMe });
      
      // Check if email is verified
      if (!user.emailVerified) {
        setUnverifiedEmail(email);
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
        setLoading(false);
        return;
      }
      
      setUnverifiedEmail(null);
      onLogin(user.email!);
      onNavigate('landing');
    } catch (err: any) {
      setUnverifiedEmail(null);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // For demo, auto-fill credentials
    setEmail('demo@gigshield.com');
    setPassword('demo123');
    // Note: You'll need to create this demo account in Firebase first
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-2xl mb-6 hover:scale-110 transition-transform duration-300">
            <Shield className="w-12 h-12 text-[#d4af37]" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">GigShield</h1>
          <p className="text-white/80 text-lg font-medium">Protect your gig work, defend your income</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mb-8 font-medium">Sign in to continue to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5 tracking-tight">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#d4af37] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#0d9488] rounded" 
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError('Please enter your email first');
                    return;
                  }
                  try {
                    const { resetPassword } = await import('../services/authService');
                    await resetPassword(email);
                    setError('');
                    alert(`Password reset email sent to ${email}! Check your inbox.`);
                  } catch (err: any) {
                    setError(err.message || 'Failed to send reset email');
                  }
                }}
                className="text-sm text-[#d4af37] hover:text-[#d4af37]/80 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-slate-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] tracking-tight"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend Verification Email */}
          {unverifiedEmail && (
            <div className="mt-4">
              <button
                onClick={async () => {
                  try {
                    const { resendVerificationEmail } = await import('../services/authService');
                    await resendVerificationEmail();
                    setError('');
                    alert('Verification email sent! Please check your inbox.');
                  } catch (err: any) {
                    setError(err.message || 'Failed to send verification email');
                  }
                }}
                className="w-full bg-blue-50 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Resend Verification Email
              </button>
            </div>
          )}

          {/* Google Sign-In */}
          <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  setError('');
                  setLoading(true);
                  const { loginWithGoogle } = await import('../services/authService');
                  const user = await loginWithGoogle();
                  onLogin(user.email!);
                  onNavigate('landing');
                } catch (err: any) {
                  setError(err.message || 'Failed to sign in with Google');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full bg-white border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Demo Login */}
          <div className="mt-4">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Try Demo Account
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-600">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-[#d4af37] hover:text-[#d4af37]/80 font-semibold"
            >
              Sign up for free
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm mt-6">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default Login;