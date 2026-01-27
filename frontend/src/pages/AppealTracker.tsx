import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Plus, Calendar, FileText, ArrowLeft, Trash2 } from 'lucide-react';
import { getMyAppeals, deleteAppeal } from '../services/apiService';
import { useAuth } from '../hooks/useAuths';

interface AppealTrackerProps {
  onNavigate: (page: string) => void;
}

interface Appeal {
  id: string;
  platform: string;
  deactivationReason: string;
  generatedLetter: string;
  status: string;
  createdAt: string;
  userStory?: string;
  accountTenure?: string;
  currentRating?: string;
  completionRate?: string;
  totalDeliveries?: string;
}

const AppealTracker = ({ onNavigate }: AppealTrackerProps) => {
  const { user } = useAuth();
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAppeal, setDeletingAppeal] = useState(false);

  useEffect(() => {
    const loadAppeals = async () => {
      if (!user) return;
      
      try {
        const data = await getMyAppeals();
        setAppeals(data);
      } catch (err: any) {
        console.error('Error loading appeals:', err);
        setError(err.message || 'Failed to load appeals');
      } finally {
        setLoading(false);
      }
    };

    loadAppeals();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDelete = async () => {
    if (!selectedAppeal) return;
    
    setDeletingAppeal(true);
    try {
      await deleteAppeal(selectedAppeal.id);
      setAppeals(appeals.filter(a => a.id !== selectedAppeal.id));
      setSelectedAppeal(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete appeal:', err);
      setError('Failed to delete appeal');
    } finally {
      setDeletingAppeal(false);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'DoorDash': 'bg-red-500',
      'doordash': 'bg-red-500',
      'Uber': 'bg-black',
      'uber': 'bg-black',
      'Lyft': 'bg-pink-500',
      'lyft': 'bg-pink-500',
      'Instacart': 'bg-green-500',
      'instacart': 'bg-green-500',
      'Grubhub': 'bg-orange-500',
      'grubhub': 'bg-orange-500',
    };
    return colors[platform] || 'bg-blue-500';
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'generated' || statusLower === 'pending') {
      return (
        <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Pending
        </span>
      );
    }
    if (statusLower === 'approved') {
      return (
        <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Approved
        </span>
      );
    }
    if (statusLower === 'denied') {
      return (
        <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4" />
          Denied
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        <AlertCircle className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const totalAppeals = appeals.length;
  const pendingAppeals = appeals.filter(a => a.status === 'generated' || a.status === 'pending').length;
  const approvedAppeals = appeals.filter(a => a.status === 'approved').length;
  const successRate = totalAppeals > 0 ? Math.round((approvedAppeals / totalAppeals) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading appeals...</div>
      </div>
    );
  }

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
            onClick={() => onNavigate('wizard')}
            className="flex items-center gap-2 px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#0d9488]/90 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Appeal
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

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
          {appeals.map((appeal) => (
            <div 
              key={appeal.id} 
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getPlatformColor(appeal.platform)} rounded-lg`}></div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{appeal.platform}</h3>
                    <p className="text-slate-600 text-sm">
                      {appeal.deactivationReason.substring(0, 100)}
                      {appeal.deactivationReason.length > 100 ? '...' : ''}
                    </p>
                  </div>
                </div>
                {getStatusBadge(appeal.status)}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="text-sm font-medium text-slate-700">{formatDate(appeal.createdAt)}</p>
                  </div>
                </div>
                {appeal.currentRating && (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">⭐</div>
                    <div>
                      <p className="text-xs text-slate-500">Rating</p>
                      <p className="text-sm font-medium text-slate-700">{appeal.currentRating}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAppeal(appeal)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  View Letter
                </button>
              </div>
            </div>
          ))}
        </div>

        {appeals.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Appeals Yet</h3>
            <p className="text-slate-600 mb-6">Create your first appeal using the Appeal Wizard</p>
            <button
              onClick={() => onNavigate('wizard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#0d9488]/90 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create First Appeal
            </button>
          </div>
        )}

        {/* Appeal Details Modal */}
        {selectedAppeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedAppeal(null)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Appeals</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Appeal</span>
                </button>
              </div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getPlatformColor(selectedAppeal.platform)} rounded-lg`}></div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedAppeal.platform}</h2>
                    <p className="text-slate-600">{selectedAppeal.deactivationReason}</p>
                  </div>
                </div>
                {getStatusBadge(selectedAppeal.status)}
              </div>

              {/* Details */}
              <div className="mb-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Created</p>
                  <p className="text-sm font-medium text-slate-700">{formatDate(selectedAppeal.createdAt)}</p>
                </div>
                {selectedAppeal.accountTenure && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Account Tenure</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAppeal.accountTenure}</p>
                  </div>
                )}
                {selectedAppeal.currentRating && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Rating</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAppeal.currentRating}</p>
                  </div>
                )}
                {selectedAppeal.completionRate && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Completion Rate</p>
                    <p className="text-sm font-medium text-slate-700">{selectedAppeal.completionRate}</p>
                  </div>
                )}
              </div>

              {/* User Story */}
              {selectedAppeal.userStory && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Your Explanation</h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedAppeal.userStory}</p>
                  </div>
                </div>
              )}

              {/* Appeal Letter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Generated Appeal Letter</h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-96 overflow-y-auto">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{selectedAppeal.generatedLetter}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedAppeal.generatedLetter);
                    alert('Appeal letter copied to clipboard!');
                  }}
                  className="mt-3 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors text-sm font-medium"
                >
                  Copy Letter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Delete Appeal?</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this appeal? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deletingAppeal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deletingAppeal}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingAppeal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppealTracker;