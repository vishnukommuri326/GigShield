import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Plus, Calendar, Bell, TrendingUp, FileText, Upload, MessageSquare } from 'lucide-react';

interface AppealTrackerProps {
  onNavigate: (page: string) => void;
}

interface Appeal {
  id: number;
  platform: string;
  reason: string;
  submittedDate: string;
  deadline: string;
  status: 'pending' | 'approved' | 'denied' | 'in-review';
  daysRemaining: number;
  appealText?: string;
  evidence?: string[];
  timeline: TimelineEvent[];
  platformColor: string;
}

interface TimelineEvent {
  date: string;
  event: string;
  type: 'submission' | 'update' | 'decision';
}

const AppealTracker = ({ onNavigate }: AppealTrackerProps) => {
  const [showNewAppealModal, setShowNewAppealModal] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [appeals, setAppeals] = useState<Appeal[]>([
    {
      id: 1,
      platform: 'DoorDash',
      reason: 'Customer Complaint',
      submittedDate: '2026-01-20',
      deadline: '2026-01-27',
      status: 'pending',
      daysRemaining: 7,
      platformColor: 'bg-red-500',
      appealText: 'I am writing to appeal my deactivation...',
      evidence: ['delivery_photo.jpg', 'customer_message.png', 'gps_route.pdf'],
      timeline: [
        { date: '2026-01-20 09:00 AM', event: 'Appeal submitted', type: 'submission' },
        { date: '2026-01-20 09:05 AM', event: 'Confirmation email received', type: 'update' }
      ]
    },
    {
      id: 2,
      platform: 'Uber',
      reason: 'Low Rating (4.5)',
      submittedDate: '2026-01-15',
      deadline: '2026-02-14',
      status: 'approved',
      daysRemaining: 0,
      platformColor: 'bg-black',
      appealText: 'I am appealing the low rating deactivation...',
      evidence: ['rating_history.png', 'positive_feedback.pdf'],
      timeline: [
        { date: '2026-01-15 02:00 PM', event: 'Appeal submitted', type: 'submission' },
        { date: '2026-01-18 10:30 AM', event: 'Case under review', type: 'update' },
        { date: '2026-01-22 03:15 PM', event: 'Appeal approved - Account reactivated', type: 'decision' }
      ]
    },
    {
      id: 3,
      platform: 'Instacart',
      reason: 'Missing Items Report',
      submittedDate: '2026-01-10',
      deadline: '2026-01-20',
      status: 'denied',
      daysRemaining: 0,
      platformColor: 'bg-green-500',
      appealText: 'I am appealing the deactivation for missing items...',
      evidence: ['order_receipt.jpg', 'delivery_confirmation.png'],
      timeline: [
        { date: '2026-01-10 11:00 AM', event: 'Appeal submitted', type: 'submission' },
        { date: '2026-01-12 09:00 AM', event: 'Additional documentation requested', type: 'update' },
        { date: '2026-01-13 02:00 PM', event: 'Documents submitted', type: 'update' },
        { date: '2026-01-16 04:30 PM', event: 'Appeal denied - Consider escalation', type: 'decision' }
      ]
    }
  ]);

  // New appeal form state
  const [newAppeal, setNewAppeal] = useState({
    platform: '',
    reason: '',
    submittedDate: '',
    deadline: '',
    appealText: '',
    evidence: [] as string[]
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case 'in-review':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            In Review
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

  const handleAddAppeal = () => {
    if (!newAppeal.platform || !newAppeal.reason || !newAppeal.submittedDate || !newAppeal.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const calculatedDaysRemaining = Math.ceil(
      (new Date(newAppeal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const appeal: Appeal = {
      id: appeals.length + 1,
      ...newAppeal,
      status: 'pending',
      daysRemaining: calculatedDaysRemaining,
      platformColor: 'bg-blue-500',
      timeline: [
        {
          date: new Date().toLocaleString(),
          event: 'Appeal logged in GigShield',
          type: 'submission'
        }
      ]
    };

    setAppeals([appeal, ...appeals]);
    setShowNewAppealModal(false);
    setNewAppeal({
      platform: '',
      reason: '',
      submittedDate: '',
      deadline: '',
      appealText: '',
      evidence: []
    });
  };

  const totalAppeals = appeals.length;
  const pendingAppeals = appeals.filter(a => a.status === 'pending' || a.status === 'in-review').length;
  const approvedAppeals = appeals.filter(a => a.status === 'approved').length;
  const successRate = totalAppeals > 0 ? Math.round((approvedAppeals / totalAppeals) * 100) : 0;

  const getNextAction = (appeal: Appeal) => {
    if (appeal.status === 'pending' && appeal.daysRemaining <= 3) {
      return { text: 'Follow up soon', color: 'text-orange-600', icon: Bell };
    }
    if (appeal.status === 'denied') {
      return { text: 'Consider escalation', color: 'text-red-600', icon: TrendingUp };
    }
    if (appeal.status === 'in-review') {
      return { text: 'Check for updates', color: 'text-blue-600', icon: MessageSquare };
    }
    return { text: 'Monitor status', color: 'text-slate-600', icon: Clock };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
              Appeal Tracker
            </h1>
            <p className="text-lg text-slate-600">
              Monitor all your appeal submissions in one place
            </p>
          </div>
          <button
            onClick={() => setShowNewAppealModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#0d9488]/90 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Log New Appeal
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Total Appeals</p>
            <p className="text-3xl font-bold text-[#1e3a5f]">{totalAppeals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingAppeals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedAppeals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-[#0d9488]">{successRate}%</p>
          </div>
        </div>

        {/* Appeals Grid */}
        <div className="grid gap-6 mb-8">
          {appeals.map((appeal) => {
            const nextAction = getNextAction(appeal);
            const ActionIcon = nextAction.icon;
            
            return (
              <div key={appeal.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${appeal.platformColor} rounded-lg`}></div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{appeal.platform}</h3>
                      <p className="text-slate-600">{appeal.reason}</p>
                    </div>
                  </div>
                  {getStatusBadge(appeal.status)}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Submitted</p>
                      <p className="text-sm font-medium text-slate-700">{appeal.submittedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Deadline</p>
                      <p className="text-sm font-medium text-slate-700">{appeal.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ActionIcon className={`w-5 h-5 ${nextAction.color}`} />
                    <div>
                      <p className="text-xs text-slate-500">Next Action</p>
                      <p className={`text-sm font-medium ${nextAction.color}`}>{nextAction.text}</p>
                    </div>
                  </div>
                </div>

                {appeal.daysRemaining > 0 && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    appeal.daysRemaining <= 3 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-5 h-5 ${appeal.daysRemaining <= 3 ? 'text-red-600' : 'text-blue-600'}`} />
                      <p className={`text-sm font-medium ${appeal.daysRemaining <= 3 ? 'text-red-700' : 'text-blue-700'}`}>
                        {appeal.daysRemaining} days remaining until deadline
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedAppeal(appeal)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    View Details
                  </button>
                  {appeal.status === 'denied' && (
                    <button
                      onClick={() => onNavigate('wizard')}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Escalate Appeal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {appeals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Appeals Logged</h3>
            <p className="text-slate-600 mb-6">Start tracking your appeals by logging your first one</p>
            <button
              onClick={() => setShowNewAppealModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#0d9488]/90 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Log First Appeal
            </button>
          </div>
        )}

        {/* New Appeal Modal */}
        {showNewAppealModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Log New Appeal</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Platform *</label>
                  <select
                    value={newAppeal.platform}
                    onChange={(e) => setNewAppeal({ ...newAppeal, platform: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                  >
                    <option value="">Select platform...</option>
                    <option value="DoorDash">DoorDash</option>
                    <option value="Uber">Uber</option>
                    <option value="Lyft">Lyft</option>
                    <option value="Instacart">Instacart</option>
                    <option value="Amazon Flex">Amazon Flex</option>
                    <option value="Grubhub">Grubhub</option>
                    <option value="Shipt">Shipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deactivation Reason *</label>
                  <input
                    type="text"
                    value={newAppeal.reason}
                    onChange={(e) => setNewAppeal({ ...newAppeal, reason: e.target.value })}
                    placeholder="e.g., Low rating, Customer complaint, etc."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Submitted Date *</label>
                    <input
                      type="date"
                      value={newAppeal.submittedDate}
                      onChange={(e) => setNewAppeal({ ...newAppeal, submittedDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Appeal Deadline *</label>
                    <input
                      type="date"
                      value={newAppeal.deadline}
                      onChange={(e) => setNewAppeal({ ...newAppeal, deadline: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Appeal Text (optional)</label>
                  <textarea
                    value={newAppeal.appealText}
                    onChange={(e) => setNewAppeal({ ...newAppeal, appealText: e.target.value })}
                    placeholder="Paste your appeal letter here..."
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddAppeal}
                  className="flex-1 px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#0d9488]/90 transition-colors font-semibold"
                >
                  Add Appeal
                </button>
                <button
                  onClick={() => setShowNewAppealModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appeal Details Modal */}
        {selectedAppeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${selectedAppeal.platformColor} rounded-lg`}></div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedAppeal.platform}</h2>
                    <p className="text-slate-600">{selectedAppeal.reason}</p>
                  </div>
                </div>
                {getStatusBadge(selectedAppeal.status)}
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Timeline</h3>
                <div className="space-y-3">
                  {selectedAppeal.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'submission' ? 'bg-blue-500' :
                        event.type === 'decision' ? 'bg-green-500' : 'bg-slate-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{event.event}</p>
                        <p className="text-xs text-slate-500">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appeal Text */}
              {selectedAppeal.appealText && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Appeal Letter</h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedAppeal.appealText}</p>
                  </div>
                </div>
              )}

              {/* Evidence */}
              {selectedAppeal.evidence && selectedAppeal.evidence.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Evidence Files</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedAppeal.evidence.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <Upload className="w-5 h-5 text-[#0d9488]" />
                        <span className="text-sm text-slate-700">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedAppeal(null)}
                className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppealTracker;
