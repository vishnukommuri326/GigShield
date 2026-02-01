import { ArrowLeft, FileText, Scale, MapPin, Info, AlertCircle } from 'lucide-react';

interface RightsProps {
  onNavigate: (page: string) => void;
}

const Rights = ({ onNavigate }: RightsProps) => {
  const rights = [
    {
      icon: FileText,
      title: 'Right to Explanation',
      description: 'Many states now require platforms to provide specific reasons for deactivation.',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Scale,
      title: 'Right to Appeal',
      description: 'You have the right to contest deactivations and request human review in most cases.',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: MapPin,
      title: 'State Protections',
      description: 'California, Seattle, NYC, and other areas have specific gig worker protections.',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Info,
      title: 'Documentation Rights',
      description: 'You can request the platform\'s evidence against you in many jurisdictions.',
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
            Know Your Rights
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Gig workers have more protections than platforms want you to know.
          </p>
        </div>

        {/* Rights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {rights.map((right, index) => {
            const Icon = right.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-200"
              >
                <div className={`${right.color} ${right.iconColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {right.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {right.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* News Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-amber-900 font-semibold mb-1">
              New: Seattle passed landmark deactivation protections in 2025
            </p>
            <p className="text-amber-800 text-sm">
              More cities and states are recognizing gig workers' right to fair treatment and due process.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Fight Back?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Use GigShield's free AI-powered tool to understand your deactivation and generate a professional appeal letter.
          </p>
          <button
            onClick={() => onNavigate('wizard')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Your Appeal Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rights;
