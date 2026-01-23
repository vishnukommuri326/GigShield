import { Clock, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface AppealTrackerProps {
  onNavigate: (page: string) => void;
}

const AppealTracker = ({ onNavigate }: AppealTrackerProps) => {
  const appeals = [
    {
      id: 1,
      platform: 'DoorDash',
      reason: 'Customer Complaint',
      submittedDate: '2026-01-20',
      deadline: '2026-01-25',
      status: 'pending',
      daysRemaining: 2,
    },
    {
      id: 2,
      platform: 'Uber',
      reason: 'Low Rating',
      submittedDate: '2026-01-15',
      deadline: '2026-01-20',
      status: 'approved',
      daysRemaining: 0,
    },
    {
      id: 3,
      platform: 'Instacart',
      reason: 'Missing Items',
      submittedDate: '2026-01-10',
      deadline: '2026-01-15',
      status: 'denied',
      daysRemaining: 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case 'denied':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Denied
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Appeal Tracker
          </h1>
          <p className="text-lg text-slate-600">
            Monitor all your appeal submissions in one place
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Total Appeals</p>
            <p className="text-3xl font-bold text-[#1e3a5f]">3</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">1</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">1</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-[#0d9488]">50%</p>
          </div>
        </div>

        {/* Appeals List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1e3a5f] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Platform</th>
                  <th className="px-6 py-4 text-left">Reason</th>
                  <th className="px-6 py-4 text-left">Submitted</th>
                  <th className="px-6 py-4 text-left">Deadline</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {appeals.map((appeal) => (
                  <tr key={appeal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{appeal.platform}</td>
                    <td className="px-6 py-4 text-slate-600">{appeal.reason}</td>
                    <td className="px-6 py-4 text-slate-600">{appeal.submittedDate}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-600">{appeal.deadline}</p>
                        {appeal.daysRemaining > 0 && (
                          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {appeal.daysRemaining} days remaining
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(appeal.status)}</td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-2 text-[#0d9488] hover:text-[#0d9488]/80 font-medium">
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppealTracker;
