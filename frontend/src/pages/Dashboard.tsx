import { FileText, MessageSquare, FileEdit, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const quickActions = [
    {
      id: 'analyzer',
      title: 'Analyze Deactivation',
      description: 'Upload your deactivation notice and understand why your account was flagged',
      icon: FileText,
      color: 'bg-gradient-to-br from-[#0d9488] to-[#0f766e]',
      action: () => onNavigate('analyzer'),
    },
    {
      id: 'chat',
      title: 'Get Appeal Strategy',
      description: 'Answer questions about your case and get personalized appeal guidance',
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-[#1e3a5f] to-[#1e40af]',
      action: () => onNavigate('chat'),
    },
    {
      id: 'letters',
      title: 'Generate Appeal Letter',
      description: 'Create a professional, evidence-based appeal letter for your platform',
      icon: FileEdit,
      color: 'bg-gradient-to-br from-[#6366f1] to-[#4f46e5]',
      action: () => onNavigate('letters'),
    },
  ];

  const stats = [
    { label: 'Cases Analyzed', value: '2,847', icon: TrendingUp, trend: '+12%' },
    { label: 'Appeals Filed', value: '4,234', icon: AlertCircle, trend: '+18%' },
    { label: 'Workers Reinstated', value: '1,923', icon: CheckCircle, trend: '+15%' },
  ];

  const tipOfTheDay = {
    title: "Did You Know?",
    content: "Seattle's January 2025 law requires gig platforms to provide clear deactivation reasons and human review of appeals. More cities are following this model — know your rights!"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Welcome to AppealShield
          </h1>
          <p className="text-slate-600 text-lg">
            Your AI-powered deactivation appeal assistant. Let's fight for your livelihood together.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-8 h-8 text-[#0d9488]" />
                  <span className="text-green-600 text-sm font-semibold">{stat.trend}</span>
                </div>
                <p className="text-3xl font-bold text-[#1e3a5f] mb-1">{stat.value}</p>
                <p className="text-slate-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`${action.color} p-6 text-white`}>
                    <Icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip of the Day */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 rounded-lg p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="bg-amber-500 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">{tipOfTheDay.title}</h3>
              <p className="text-amber-800 leading-relaxed">{tipOfTheDay.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
