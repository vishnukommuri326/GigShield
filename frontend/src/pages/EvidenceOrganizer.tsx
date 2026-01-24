import { useState } from 'react';
import { Upload, FileText, Image, Video, Trash2, Download, CheckCircle, Circle, AlertTriangle, Camera, MessageSquare, MapPin, BarChart3, Calendar, Clock, Plus } from 'lucide-react';

interface EvidenceOrganizerProps {
  onNavigate: (page: string) => void;
}

interface EvidenceItem {
  id: number;
  name: string;
  type: 'image' | 'document' | 'video';
  size: string;
  uploadDate: string;
  tags: string[];
  category: string;
}

interface Incident {
  id: number;
  date: string;
  time: string;
  location: string;
  description: string;
  witnesses: string;
}

const EvidenceOrganizer = ({ onNavigate }: EvidenceOrganizerProps) => {
  const [selectedDeactivationType, setSelectedDeactivationType] = useState<string>('ratings');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  
  const [newIncident, setNewIncident] = useState({
    date: '',
    time: '',
    location: '',
    description: '',
    witnesses: ''
  });

  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    {
      id: 1,
      name: 'delivery_screenshot.png',
      type: 'image',
      size: '2.4 MB',
      uploadDate: '2026-01-20',
      tags: ['delivery proof', 'timestamp'],
      category: 'Performance Data'
    },
    {
      id: 2,
      name: 'customer_message.pdf',
      type: 'document',
      size: '156 KB',
      uploadDate: '2026-01-20',
      tags: ['communication', 'customer'],
      category: 'Communication'
    },
    {
      id: 3,
      name: 'gps_route.png',
      type: 'image',
      size: '1.8 MB',
      uploadDate: '2026-01-19',
      tags: ['gps', 'route proof'],
      category: 'GPS/Location'
    },
  ]);

  const deactivationTypes = [
    { id: 'ratings', label: 'Low Ratings', icon: BarChart3 },
    { id: 'completion', label: 'Completion Rate', icon: CheckCircle },
    { id: 'fraud', label: 'Fraud Allegation', icon: AlertTriangle },
    { id: 'safety', label: 'Safety Incident', icon: AlertTriangle },
    { id: 'customer', label: 'Customer Complaint', icon: MessageSquare },
    { id: 'other', label: 'Other/Unknown', icon: Circle },
  ];

  // Dynamic checklist based on deactivation type
  const getChecklistForType = (type: string) => {
    const checklists: Record<string, Array<{ id: string; label: string; completed: boolean; icon: any }>> = {
      ratings: [
        { id: '1', label: 'Screenshot of your current rating', completed: false, icon: Camera },
        { id: '2', label: 'Screenshot of rating history/trends', completed: true, icon: BarChart3 },
        { id: '3', label: 'Screenshots of positive customer reviews', completed: false, icon: MessageSquare },
        { id: '4', label: 'Proof of completed deliveries/rides count', completed: true, icon: CheckCircle },
        { id: '5', label: 'Any communication about rating issues', completed: false, icon: MessageSquare },
      ],
      completion: [
        { id: '1', label: 'Screenshot of completion rate', completed: true, icon: BarChart3 },
        { id: '2', label: 'List of cancelled orders with reasons', completed: false, icon: FileText },
        { id: '3', label: 'App screenshots showing cancellation reasons', completed: false, icon: Camera },
        { id: '4', label: 'Evidence of app glitches/technical issues', completed: false, icon: AlertTriangle },
        { id: '5', label: 'GPS data for disputed orders', completed: true, icon: MapPin },
      ],
      fraud: [
        { id: '1', label: 'GPS/location data for disputed orders', completed: true, icon: MapPin },
        { id: '2', label: 'Photos of completed deliveries', completed: true, icon: Camera },
        { id: '3', label: 'Customer communication screenshots', completed: false, icon: MessageSquare },
        { id: '4', label: 'Proof of payment/tips received', completed: false, icon: FileText },
        { id: '5', label: 'Dashcam footage (if applicable)', completed: false, icon: Video },
        { id: '6', label: 'Timestamp evidence', completed: false, icon: Clock },
      ],
      safety: [
        { id: '1', label: 'Dashcam footage of incident', completed: false, icon: Video },
        { id: '2', label: 'Police report (if filed)', completed: false, icon: FileText },
        { id: '3', label: 'Witness statements', completed: false, icon: MessageSquare },
        { id: '4', label: 'Photos of damage/scene', completed: false, icon: Camera },
        { id: '5', label: 'GPS/location data', completed: false, icon: MapPin },
        { id: '6', label: 'Insurance documentation', completed: false, icon: FileText },
      ],
      customer: [
        { id: '1', label: 'Customer message screenshots', completed: true, icon: MessageSquare },
        { id: '2', label: 'Photos of delivery/order', completed: true, icon: Camera },
        { id: '3', label: 'GPS proof of delivery location', completed: false, icon: MapPin },
        { id: '4', label: 'Timestamp evidence', completed: false, icon: Clock },
        { id: '5', label: 'Your response to customer', completed: false, icon: MessageSquare },
      ],
      other: [
        { id: '1', label: 'Copy of deactivation notice', completed: false, icon: FileText },
        { id: '2', label: 'All platform communication', completed: false, icon: MessageSquare },
        { id: '3', label: 'Account history screenshots', completed: false, icon: BarChart3 },
        { id: '4', label: 'Any relevant evidence', completed: false, icon: Camera },
      ],
    };
    return checklists[type] || checklists.other;
  };

  const handleAddIncident = () => {
    if (newIncident.date && newIncident.description) {
      setIncidents([...incidents, { ...newIncident, id: Date.now() }]);
      setNewIncident({ date: '', time: '', location: '', description: '', witnesses: '' });
      setShowIncidentForm(false);
    }
  };

  const calculateEvidenceStrength = () => {
    const checklist = getChecklistForType(selectedDeactivationType);
    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;
    const percentage = (completed / total) * 100;
    
    if (percentage >= 80) return { label: 'Strong', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 50) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />;
      case 'video':
        return <Video className="w-8 h-8 text-purple-500" />;
      case 'document':
        return <FileText className="w-8 h-8 text-green-500" />;
      default:
        return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  const strength = calculateEvidenceStrength();
  const checklist = getChecklistForType(selectedDeactivationType);
  const completedCount = checklist.filter(item => item.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Evidence Organizer
          </h1>
          <p className="text-lg text-slate-600">
            Build a strong case with organized evidence and documentation
          </p>
        </div>

        {/* Deactivation Type Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">What type of deactivation are you appealing?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {deactivationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedDeactivationType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDeactivationType === type.id
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${selectedDeactivationType === type.id ? 'text-blue-600' : 'text-slate-600'}`} />
                  <div className={`text-sm font-medium text-center ${selectedDeactivationType === type.id ? 'text-blue-900' : 'text-slate-700'}`}>
                    {type.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Evidence Strength Indicator */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">Evidence Strength</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${strength.bg} mb-4`}>
              <div className={`w-3 h-3 rounded-full ${strength.color.replace('text-', 'bg-')}`}></div>
              <span className={`font-bold ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Checklist Progress</span>
                <span className="font-semibold text-slate-900">{completedCount}/{checklist.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              {completedCount === checklist.length ? 
                '🎉 Excellent! You have all recommended evidence.' :
                `Collect ${checklist.length - completedCount} more items to strengthen your case.`
              }
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">Evidence Files</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Images</span>
                </div>
                <span className="font-bold text-slate-900">{evidenceItems.filter(i => i.type === 'image').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Documents</span>
                </div>
                <span className="font-bold text-slate-900">{evidenceItems.filter(i => i.type === 'document').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-700">Videos</span>
                </div>
                <span className="font-bold text-slate-900">{evidenceItems.filter(i => i.type === 'video').length}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Total Files</span>
                  <span className="font-bold text-blue-600">{evidenceItems.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Logs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">Incident Logs</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Documented Incidents</span>
                <span className="font-bold text-slate-900">{incidents.length}</span>
              </div>
              <button
                onClick={() => setShowIncidentForm(true)}
                className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Log New Incident
              </button>
            </div>
          </div>
        </div>

        {/* Evidence Checklist */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
            Evidence Checklist for {deactivationTypes.find(t => t.id === selectedDeactivationType)?.label}
          </h2>
          <div className="space-y-3">
            {checklist.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    item.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    item.completed
                      ? 'border-green-600 bg-green-600'
                      : 'border-slate-300'
                  }`}>
                    {item.completed && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                  <Icon className={`w-5 h-5 ${item.completed ? 'text-green-600' : 'text-slate-500'}`} />
                  <span className={`flex-1 ${item.completed ? 'text-green-900 font-medium' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                  {item.completed && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                      Collected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Form Modal */}
        {showIncidentForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Document Incident</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={newIncident.date}
                      onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={newIncident.time}
                      onChange={(e) => setNewIncident({ ...newIncident, time: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                    placeholder="Address or general area"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    What Happened?
                  </label>
                  <textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    placeholder="Describe the incident in detail: what happened, who was involved, what was said, etc."
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Witnesses (Optional)
                  </label>
                  <input
                    type="text"
                    value={newIncident.witnesses}
                    onChange={(e) => setNewIncident({ ...newIncident, witnesses: e.target.value })}
                    placeholder="Names or descriptions of any witnesses"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowIncidentForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIncident}
                  disabled={!newIncident.date || !newIncident.description}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Save Incident
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Incident Log List */}
        {incidents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Documented Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{incident.date} {incident.time && `at ${incident.time}`}</div>
                        {incident.location && (
                          <div className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {incident.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-2">{incident.description}</p>
                  {incident.witnesses && (
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      Witnesses: {incident.witnesses}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Upload Evidence Files</h2>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-[#0d9488] transition-colors cursor-pointer">
            <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Drag & Drop Files Here
            </h3>
            <p className="text-slate-500 mb-4">
              Or click to browse your files
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Supports: Images (JPG, PNG), PDFs, Videos (MP4), Screenshots
            </p>
            <button className="px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors font-semibold">
              Choose Files
            </button>
          </div>
        </div>

        {/* Evidence Files List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">Your Evidence Files</h2>
          <div className="space-y-4">
            {evidenceItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-[#0d9488] hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  {getFileIcon(item.type)}
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>Uploaded {item.uploadDate}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">{item.category}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-[#0d9488]/10 text-[#0d9488] text-xs rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-600 hover:text-[#0d9488] hover:bg-slate-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceOrganizer;
