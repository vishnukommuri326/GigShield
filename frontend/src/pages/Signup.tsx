// frontend/src/pages/Signup.tsx (or wherever your Signup.tsx is)
// REPLACE YOUR EXISTING FILE WITH THIS

import { useState } from 'react';
import { Mail, Lock, User, Shield, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { signUp } from '../services/authService';  // NEW IMPORT

interface SignupProps {
  onNavigate: (page: string) => void;
  onSignup: (email: string, name: string) => void;
}

const Signup = ({ onNavigate, onSignup }: SignupProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    // CHANGED: Now uses real Firebase auth
    try {
      const user = await signUp({ email, password, name });
      onSignup(user.email!, name);
      onNavigate('dashboard');
    } catch (err: any) {
      // Handle specific Firebase errors
      if (err.message.includes('email-already-in-use')) {
        setError('This email is already registered. Try logging in instead.');
      } else if (err.message.includes('weak-password')) {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Shield className="w-10 h-10 text-[#0d9488]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">GigShield</h1>
          <p className="text-white/90 text-lg">Join thousands protecting their income</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Create Your Account</h2>
          <p className="text-slate-600 mb-6">Start your free trial today - no credit card required</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                />
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600">Password strength</span>
                    <span className={`font-medium ${strength.strength === 100 ? 'text-green-600' : strength.strength === 66 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${strength.color}`}
                      style={{ width: `${strength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 text-[#0d9488] rounded mt-0.5"
              />
              <label className="text-sm text-slate-600">
                I agree to the{' '}
                <button type="button" className="text-[#0d9488] hover:underline font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-[#0d9488] hover:underline font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0d9488] to-[#14b8a6] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">What you get for free:</p>
            <ul className="space-y-1 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                1 free appeal letter generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Access to Know Your Rights database
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                24/7 chatbot support
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[#0d9488] hover:text-[#0d9488]/80 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm mt-6">
          🔒 Your data is encrypted and never shared with platforms
        </p>
      </div>
    </div>
  );
};

export default Signup;