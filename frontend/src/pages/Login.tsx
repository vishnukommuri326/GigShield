import { useState } from 'react';
import { Mail, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
  onLogin: (email: string) => void;
}

const Login = ({ onNavigate, onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, accept any email/password
      onLogin(email);
      onNavigate('dashboard');
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail('demo@gigshield.com');
    setPassword('demo123');
    setTimeout(() => {
      onLogin('demo@gigshield.com');
      onNavigate('dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Shield className="w-10 h-10 text-[#0d9488]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">GigShield</h1>
          <p className="text-white/90 text-lg">Protect your gig work, defend your income</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                <input type="checkbox" className="w-4 h-4 text-[#0d9488] rounded" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#0d9488] hover:text-[#0d9488]/80 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0d9488] to-[#14b8a6] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="text-[#0d9488] hover:text-[#0d9488]/80 font-semibold"
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
