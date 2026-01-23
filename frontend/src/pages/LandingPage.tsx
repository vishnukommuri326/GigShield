import { ArrowRight, Clock, FileText, Shield, Users, TrendingUp, AlertTriangle, Upload, Search, Pencil, Send } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage = ({ onNavigate }: LandingPageProps) => {
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
      value: '60%',
      label: 'Appeal success rate',
      subtext: 'when properly documented',
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
      description: 'Our AI identifies the deactivation reason, deadline, and your platform-specific rights.',
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
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">AppealShield</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#platforms" className="text-slate-600 hover:text-slate-900 transition-colors">
              Platforms
            </a>
            <a href="#rights" className="text-slate-600 hover:text-slate-900 transition-colors">
              Know Your Rights
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Learn More
            </button>
            <button
              onClick={() => onNavigate('analyzer')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Appeal
            </button>
          </div>
        </div>
      </header>

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
          AppealShield helps you understand your rights and craft winning appeals — for free.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => onNavigate('analyzer')}
            className="bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Start Your Appeal
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
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
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How AppealShield Works</h2>
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">AppealShield</span>
            </div>
            <p className="text-slate-400 text-sm">© 2026 AppealShield. Fighting for gig workers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
