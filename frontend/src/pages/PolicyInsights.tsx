import { ArrowLeft, FileText, AlertCircle, Database, TrendingUp } from 'lucide-react';

interface PolicyInsightsProps {
  onNavigate: (page: string) => void;
}

const PolicyInsights = ({ onNavigate }: PolicyInsightsProps) => {
  const insights = [
    {
      icon: FileText,
      title: 'Deactivation Reasons',
      description: 'Platforms typically cite ratings, completion rates, safety flags, or contract violations. Specificity varies widely.',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: AlertCircle,
      title: 'Appeal Mechanisms',
      description: 'Most platforms offer internal appeal processes. Response times and review depth differ significantly by platform.',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Database,
      title: 'Policy Variations',
      description: 'Some jurisdictions require specific disclosures or human review processes. Enforcement varies.',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: TrendingUp,
      title: 'Platform Trends',
      description: 'Observed patterns in deactivation categories, appeal response rates, and policy updates across platforms.',
      color: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Platform Policy Insights
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Understanding enforcement patterns across gig platforms
          </p>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-200"
              >
                <div className={`${insight.color} ${insight.iconColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {insight.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-blue-900 font-semibold mb-1">
              Policy transparency requirements evolving
            </p>
            <p className="text-blue-800 text-sm">
              Some jurisdictions now mandate specific disclosures for platform deactivations. This system aggregates observed patterns.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Analyze Your Case
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Use GigShield's structured analysis tool to understand your deactivation and prepare an organized appeal.
          </p>
          <button
            onClick={() => onNavigate('wizard')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyInsights;
