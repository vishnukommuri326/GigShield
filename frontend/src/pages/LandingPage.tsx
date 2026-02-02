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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-[30]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">GigShield</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {user && user.displayName && (
              <span className="text-sm font-medium text-slate-700">
                Hello, {user.displayName}
              </span>
            )}
            <button 
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </button>
            <a href="#platforms" className="text-slate-600 hover:text-slate-900 transition-colors">
              Platforms
            </a>
            <button 
              onClick={() => onNavigate('policy-insights')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Policy Insights
            </button>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowTestPanel(!showTestPanel)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  <Activity className="w-4 h-4" />
                  Test Backend
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">Backend Connection Test</h3>
              </div>
              <button
                onClick={() => setShowTestPanel(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 mb-4">
              Test the connection between your frontend and the FastAPI backend.
            </p>

            <button
              onClick={testBackendConnection}
              disabled={testLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-8 border border-blue-200">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Free AI-Powered Appeal Assistant</span>
        </div>

        <h1 className="text-6xl font-bold text-slate-900 mb-6">
          Deactivated? <span className="text-blue-600">Fight Back.</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Gig platforms deactivate workers with vague explanations and opaque processes. 
          GigShield helps you understand platform policies and craft structured appeals — for free.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => onNavigate('wizard')}
            className="bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Start Your Appeal
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            See How It Works
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 text-slate-600">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="text-sm">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-5xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-slate-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-500">{stat.subtext}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How GigShield Works</h2>
          <p className="text-xl text-slate-600">
            From deactivation notice to submitted appeal in minutes — not days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {step.number}
                  </div>
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('analyzer')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Supported Platforms</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              GigShield works with deactivation notices from all major gig platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer group"
              >
                <div className={`bg-gradient-to-br ${platform.gradient} h-20 rounded-lg mb-4 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <span className="text-white font-black text-xl tracking-tight">
                    {platform.text}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-center text-sm">{platform.name}</h3>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">
              Don't see your platform? <span className="font-semibold">GigShield works with any gig platform.</span>
            </p>
            <button
              onClick={() => onNavigate('wizard')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Your Appeal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">GigShield</span>
            </div>
            <p className="text-slate-400 text-sm">© 2026 GigShield. Fighting for gig workers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;