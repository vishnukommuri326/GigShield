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
      color: 'bg-[#0f172a]',
      action: () => onNavigate('analyzer'),
    },
    {
      id: 'chat',
      title: 'Get Appeal Strategy',
      description: 'Answer questions about your case and get personalized appeal guidance',
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-[#1e293b] to-[#334155]',
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
    content: "Seattle's January 2025 law requires gig platforms to provide clear deactivation reasons and human review of appeals. More cities are adopting similar disclosure requirements."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-5xl font-extrabold text-[#0f172a] mb-3 tracking-tight">
            Welcome to GigShield
          </h1>
          <p className="text-slate-600 text-xl font-medium">
            Your AI-powered deactivation appeal assistant. Let's fight for your livelihood together.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 border border-slate-100 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[#d4af37]" />
                  </div>
                  <span className="text-green-600 text-sm font-bold bg-green-50 px-3 py-1.5 rounded-full">{stat.trend}</span>
                </div>
                <p className="text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">{stat.value}</p>
                <p className="text-slate-600 text-sm font-semibold">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#0f172a] mb-6 tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="group relative overflow-hidden rounded-2xl shadow-lg shadow-slate-300/50 hover:shadow-2xl hover:shadow-slate-400/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
                >
                  <div className={`${action.color} p-8 text-white relative z-10`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 inline-flex mb-5 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-extrabold mb-3 tracking-tight">{action.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed font-medium">
                      {action.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
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
