import { ArrowRight, Clock, FileText, Shield, Users, TrendingUp, AlertTriangle, Upload, Search, Pencil, Send, LogOut, Activity, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuths';
import { logout } from '../services/authService';
import { checkHealth } from '../services/apiService';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState('');
  const [showTestPanel, setShowTestPanel] = useState(false);

  const handleLogout = async () => {
    await logout();
    onNavigate('login');
  };

  const testBackendConnection = async () => {
    setTestLoading(true);
    setTestError('');
    setTestResult(null);

    try {
      const health = await checkHealth();
      setTestResult(health);
      console.log('✅ Backend health check:', health);
    } catch (err: any) {
      setTestError(err.message);
      console.error('❌ Backend test failed:', err);
    } finally {
      setTestLoading(false);
    }
  };

  const stats = [
    {
      icon: Users,
      value: '7M+',
      label: 'Gig workers in the US',
      subtext: 'rely on app-based work for income',
    },
    {
      icon: AlertTriangle,
      value: '30%',
      label: 'Face deactivation',
      subtext: 'at some point in their gig career',
    },
    {
      icon: Clock,
      value: '< 24hrs',
      label: 'Average warning time',
      subtext: 'before losing all income',
    },
    {
      icon: TrendingUp,
      value: 'Varies',
      label: 'Outcomes by platform',
      subtext: 'success depends on case specifics',
    },
  ];

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Share Your Notice',
      description: 'Paste or upload the deactivation notice you received from the platform.',
    },
    {
      number: 2,
      icon: Search,
      title: 'We Analyze',
      description: 'Our AI identifies the deactivation reason, deadline, and relevant platform policies.',
    },
    {
      number: 3,
      icon: Pencil,
      title: 'Generate Appeal',
      description: 'Answer a few questions and we\'ll create a personalized, professional appeal letter.',
    },
    {
      number: 4,
      icon: Send,
      title: 'Submit & Track',
      description: 'Copy your letter, submit it to the platform, and track your appeal status.',
    },
  ];

  const features = [
    { icon: Clock, text: 'Generate appeals in 5 minutes' },
    { icon: FileText, text: 'Platform-specific guidance' },
    { icon: Shield, text: '100% free to use' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/95 backdrop-blur-xl sticky top-0 z-[30] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-xl p-2.5 shadow-lg">
              <Shield className="w-7 h-7 text-[#d4af37]" />
            </div>
            <span className="text-2xl font-extrabold text-[#0f172a] tracking-tight">GigShield</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {user && user.displayName && (
              <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
                Hello, {user.displayName}
              </span>
            )}
            <button 
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-600 hover:text-[#0f172a] transition-colors font-semibold"
            >
              How It Works
            </button>
            <a href="#platforms" className="text-slate-600 hover:text-[#0f172a] transition-colors font-semibold">
              Platforms
            </a>
            <button 
              onClick={() => onNavigate('policy-insights')}
              className="text-slate-600 hover:text-[#0f172a] transition-colors font-semibold"
            >
              Policy Insights
            </button>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowTestPanel(!showTestPanel)}
                  className="flex items-center gap-2 text-slate-600 hover:text-[#0f172a] transition-colors font-semibold"
                >
                  <Activity className="w-5 h-5" />
                  Test Backend
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-slate-600 hover:text-[#0f172a] transition-colors font-semibold"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="bg-[#0f172a] text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-slate-400/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Backend Test Panel - Only show if user is logged in */}
      {user && showTestPanel && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white border-2 border-[#d4af37]/30 rounded-2xl p-8 shadow-2xl shadow-[#d4af37]/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 rounded-xl">
                  <Activity className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Backend Connection Test</h3>
              </div>
              <button
                onClick={() => setShowTestPanel(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold hover:scale-110 transition-all"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 mb-6 font-medium">
              Test the connection between your frontend and the FastAPI backend.
            </p>

            <button
              onClick={testBackendConnection}
              disabled={testLoading}
              className="bg-[#0f172a] text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-slate-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              {testLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Testing...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Test Connection
                </>
              )}
            </button>

            {/* Success Result */}
            {testResult && !testError && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Backend Connection Working!</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p><strong>Status:</strong> {testResult.status}</p>
                      <p><strong>Firebase:</strong> {testResult.firebase_configured ? '✅ Configured' : '❌ Not configured'}</p>
                      <p><strong>Anthropic API:</strong> {testResult.anthropic_configured ? '✅ Configured' : '❌ Not configured'}</p>
                    </div>
                    <pre className="mt-3 p-3 bg-green-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Error Result */}
            {testError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-2">❌ Connection Failed</h4>
                    <p className="text-sm text-red-800">{testError}</p>
                    <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-900">
                      <p className="font-semibold mb-1">Troubleshooting:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Make sure backend is running: <code className="bg-red-200 px-1 rounded">python -m app.main</code></li>
                        <li>Check backend is at: <code className="bg-red-200 px-1 rounded">http://localhost:8000</code></li>
                        <li>Look for CORS errors in browser console (F12)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
              <p><strong>Logged in as:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.uid}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#0f172a]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37]/10 to-[#f4d03f]/10 text-[#0f172a] px-6 py-3 rounded-full mb-10 border-2 border-[#d4af37]/20 shadow-lg hover:scale-105 transition-transform animate-fadeIn">
            <Shield className="w-5 h-5 text-[#d4af37]" />
            <span className="text-sm font-bold tracking-tight">Free AI-Powered Appeal Assistant</span>
          </div>

          <h1 className="text-7xl font-extrabold text-[#0f172a] mb-8 tracking-tight leading-tight animate-fadeIn">
            Deactivated? <span className="gradient-text bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">Fight Back.</span>
          </h1>

          <p className="text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium animate-fadeIn">
            Gig platforms deactivate workers with vague explanations and opaque processes. 
            GigShield helps you understand platform policies and craft structured appeals — for free.
          </p>

          <div className="flex items-center justify-center gap-6 mb-16 animate-fadeIn">
            <button
              onClick={() => onNavigate('wizard')}
              className="bg-[#0f172a] text-white px-10 py-5 rounded-xl font-extrabold text-lg hover:shadow-2xl hover:shadow-slate-400/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              Start Your Appeal
              <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-[#0f172a] text-[#0f172a] px-10 py-5 rounded-xl font-extrabold text-lg hover:bg-[#0f172a] hover:text-white transition-all transform hover:scale-105 active:scale-95"
            >
              See How It Works
            </button>
          </div>

          <div className="flex items-center justify-center gap-12 text-slate-600 animate-fadeIn">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-2 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <span className="text-base font-semibold">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-white via-slate-50 to-white border-y border-slate-100 py-20 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="inline-flex p-4 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Icon className="w-12 h-12 text-[#d4af37]" />
                  </div>
                  <div className="text-5xl font-extrabold text-[#0f172a] mb-3 tracking-tight">{stat.value}</div>
                  <div className="text-lg font-bold text-slate-800 mb-2">{stat.label}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.subtext}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20 animate-fadeIn">
          <h2 className="text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">How GigShield Works</h2>
          <p className="text-2xl text-slate-600 font-medium">
            From deactivation notice to submitted appeal in minutes — not days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group bg-white border-2 border-slate-100 rounded-2xl p-10 hover:shadow-2xl hover:shadow-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-[#d4af37] rounded-xl w-14 h-14 flex items-center justify-center font-extrabold text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  <div className="p-3 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 rounded-xl group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-[#d4af37]" />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0f172a] mb-4 tracking-tight">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => onNavigate('analyzer')}
            className="bg-[#0f172a] text-white px-12 py-5 rounded-xl font-extrabold text-lg hover:shadow-2xl hover:shadow-slate-400/20 transition-all transform hover:scale-105 active:scale-95"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="bg-gradient-to-br from-white via-slate-50 to-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 animate-fadeIn">
            <h2 className="text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">Supported Platforms</h2>
            <p className="text-2xl text-slate-600 max-w-2xl mx-auto font-medium">
              GigShield works with deactivation notices from all major gig platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { name: 'DoorDash', gradient: 'from-red-500 to-red-600', text: 'DD' },
              { name: 'Uber', gradient: 'from-black to-gray-900', text: 'uber' },
              { name: 'Lyft', gradient: 'from-pink-500 to-pink-600', text: 'lyft' },
              { name: 'Instacart', gradient: 'from-green-500 to-green-600', text: 'instacart' },
              { name: 'Grubhub', gradient: 'from-orange-500 to-orange-600', text: 'grubhub' },
              { name: 'Amazon Flex', gradient: 'from-blue-500 to-blue-700', text: 'amazon' },
              { name: 'Postmates', gradient: 'from-yellow-500 to-yellow-600', text: 'postmates' },
              { name: 'Shipt', gradient: 'from-purple-500 to-purple-600', text: 'shipt' },
              { name: 'Uber Eats', gradient: 'from-green-600 to-green-700', text: 'UberEATS' },
              { name: 'Spark', gradient: 'from-yellow-600 to-orange-600', text: 'spark' },
            ].map((platform, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-slate-100 rounded-2xl p-6 hover:shadow-2xl hover:shadow-slate-300/50 transition-all hover:border-[#d4af37]/30 cursor-pointer hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${platform.gradient} h-24 rounded-xl mb-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-black text-2xl tracking-tight">
                    {platform.text}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-center text-sm">{platform.name}</h3>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-6 text-lg font-medium">
              Don't see your platform? <span className="font-bold text-[#0f172a]">GigShield works with any gig platform.</span>
            </p>
            <button
              onClick={() => onNavigate('wizard')}
              className="bg-[#0f172a] text-white px-12 py-5 rounded-xl font-extrabold text-lg hover:shadow-2xl hover:shadow-slate-400/20 transition-all transform hover:scale-105 active:scale-95"
            >
              Start Your Appeal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-16 border-t-4 border-[#d4af37]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl shadow-lg">
                <Shield className="w-7 h-7 text-[#0f172a]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">GigShield</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">© 2026 GigShield. Fighting for gig workers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;