import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, MapPin, FileText, Zap, Eye, Lock, Scale, Info, Search } from 'lucide-react';
import { searchKnowledgeBase } from '../services/apiService';

interface KnowledgeBaseProps {
  onNavigate: (page: string) => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  state: string;
  platform: string;
  content: string;
  tags: string[];
  relevance_score?: number;
}

const KnowledgeBase = ({ onNavigate }: KnowledgeBaseProps) => {
  const [selectedState, setSelectedState] = useState('California');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const result = await searchKnowledgeBase(searchQuery);
      setSearchResults(result.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const states = [
    'California', 'Washington', 'New York', 'Illinois', 'New Jersey', 'Texas', 'Florida', 'Other'
  ];

  const stateProtections: Record<string, { laws: string[]; protections: string[] }> = {
    California: {
      laws: ['AB5 (2019)', 'Prop 22 (2020)', 'AB2257 (2020)'],
      protections: [
        'Platforms typically provide explanation for deactivation',
        'Appeal processes with human review available',
        'Cannot be deactivated solely for declining orders',
        'Transparency requirements for rating systems',
        'Deactivation standards defined in contractor agreements'
      ]
    },
    Washington: {
      laws: ['Seattle Gig Worker Protections (2025)', 'PayUp Act'],
      protections: [
        'Platforms must provide specific deactivation reason',
        'Appeal processes with evidence submission',
        'Warning systems for first-time policy violations',
        'Multi-step review before permanent deactivation'
      ]
    },
    'New York': {
      laws: ['NYC Gig Worker Protections (2023)', 'Delivery Worker Standards'],
      protections: [
        'Transparency requirements in deactivation process',
        'Anti-retaliation provisions',
        'Notice period requirements for certain deactivations',
        'Earnings data access provisions'
      ]
    },
    Illinois: {
      laws: ['Labor law protections'],
      protections: [
        'Standard independent contractor provisions',
        'Anti-discrimination laws apply',
        'Contract-based remedies available'
      ]
    },
    'New Jersey': {
      laws: ['Independent contractor protections'],
      protections: [
        'Appeal mechanisms typically available',
        'Fair dealing requirements in contracts',
        'Policy transparency standards'
      ]
    },
    Other: {
      laws: ['Federal labor laws', 'State-specific provisions'],
      protections: [
        'Standard contract enforcement mechanisms',
        'Federal anti-discrimination laws apply',
        'Check your jurisdiction\'s specific platform regulations'
      ]
    }
  };

  const platformComparison = [
    {
      platform: 'DoorDash',
      appealProcess: 'moderate',
      transparency: 'low',
      responseTime: '7-14 days',
      successRate: 45,
      minRating: '4.2',
      minCompletion: '80%',
      color: 'bg-red-500'
    },
    {
      platform: 'Uber',
      appealProcess: 'difficult',
      transparency: 'low',
      responseTime: '14-30 days',
      successRate: 35,
      minRating: '4.6',
      minCompletion: 'N/A',
      color: 'bg-black'
    },
    {
      platform: 'Lyft',
      appealProcess: 'moderate',
      transparency: 'moderate',
      responseTime: '10-21 days',
      successRate: 50,
      minRating: '4.7',
      minCompletion: 'N/A',
      color: 'bg-pink-500'
    },
    {
      platform: 'Instacart',
      appealProcess: 'easy',
      transparency: 'moderate',
      responseTime: '5-10 days',
      successRate: 65,
      minRating: '4.6',
      minCompletion: 'N/A',
      color: 'bg-green-500'
    },
    {
      platform: 'Amazon Flex',
      appealProcess: 'difficult',
      transparency: 'low',
      responseTime: '14-30 days',
      successRate: 30,
      minRating: 'Fantastic',
      minCompletion: 'N/A',
      color: 'bg-orange-500'
    }
  ];

  const redFlags = [
    {
      icon: AlertTriangle,
      title: 'Declining Rating',
      description: 'Your rating dropped below platform minimum in last 30 days',
      severity: 'high',
      action: 'Focus on improving service quality, communicate proactively with customers'
    },
    {
      icon: TrendingDown,
      title: 'Low Completion Rate',
      description: 'Completion rate below 80% threshold',
      severity: 'high',
      action: 'Only accept orders you can complete, avoid last-minute cancellations'
    },
    {
      icon: AlertTriangle,
      title: 'Multiple Customer Complaints',
      description: 'More than 2 complaints in the past week',
      severity: 'medium',
      action: 'Document all deliveries with photos, save all customer communications'
    },
    {
      icon: Eye,
      title: 'Under Review Status',
      description: 'Account showing "under review" or similar warning',
      severity: 'high',
      action: 'Prepare evidence now, document everything, expect possible deactivation'
    },
    {
      icon: Lock,
      title: 'Policy Violation Warning',
      description: 'Received warning about ToS violation',
      severity: 'critical',
      action: 'Stop the behavior immediately, review platform policies, prepare appeal materials'
    }
  ];

  const proactiveTips = [
    {
      icon: Shield,
      category: 'Documentation',
      tips: [
        'Take photos of every delivery (with timestamp)',
        'Screenshot completion confirmations',
        'Save all customer messages',
        'Track your stats weekly (rating, completion rate)',
        'Keep a log of any unusual incidents'
      ]
    },
    {
      icon: Zap,
      category: 'Best Practices',
      tips: [
        'Communicate proactively with customers',
        'Follow platform guidelines exactly',
        'Use professional language in all communications',
        'Double-check orders before leaving restaurant',
        'Confirm delivery instructions before starting'
      ]
    },
    {
      icon: FileText,
      category: 'Tech Setup',
      tips: [
        'Install dashcam (front and rear if driving)',
        'Use timestamp apps for photos',
        'Keep platform app updated',
        'Have backup GPS tracking enabled',
        'Save receipts for any platform-related expenses'
      ]
    },
    {
      icon: Scale,
      category: 'Know Your Thresholds',
      tips: [
        'Check your platform\'s minimum rating requirement',
        'Know the completion rate threshold',
        'Understand what counts as a violation',
        'Review ToS updates regularly',
        'Know your state\'s gig worker protections'
      ]
    }
  ];

  const currentProtections = stateProtections[selectedState] || stateProtections.Other;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-600 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getProcessColor = (process: string) => {
    switch (process) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'difficult': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Platform Policy Insights
          </h1>
          <p className="text-lg text-slate-600">
            State protections, platform comparisons, and proactive tips to protect your account
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-6 h-6 text-[#0d9488]" />
            <h2 className="text-xl font-bold text-slate-800">Search Knowledge Base</h2>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for laws, policies, appeal strategies..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Search Results ({searchResults.length})</h3>
              {searchResults.map((article) => (
                <div 
                  key={article.id} 
                  className="border border-slate-200 rounded-lg p-4 hover:border-[#0d9488] transition-colors cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-[#1e3a5f]">{article.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">{article.category}</span>
                        {article.state !== 'All' && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{article.state}</span>
                        )}
                        {article.platform !== 'All' && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{article.platform}</span>
                        )}
                      </div>
                    </div>
                    {article.relevance_score && (
                      <span className="text-xs text-slate-500">Score: {article.relevance_score}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{article.content.substring(0, 150)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Article Detail Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">{selectedArticle.title}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{selectedArticle.category}</span>
                  {selectedArticle.state !== 'All' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">{selectedArticle.state}</span>
                  )}
                  {selectedArticle.platform !== 'All' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">{selectedArticle.platform}</span>
                  )}
                </div>
              </div>
              <div className="prose max-w-none mb-6">
                <pre className="whitespace-pre-wrap text-slate-700 font-sans">{selectedArticle.content}</pre>
              </div>
              {selectedArticle.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* State Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <MapPin className="w-6 h-6 text-[#0d9488]" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Your State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* State Protections */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#0d9488]" />
                Applicable Laws
              </h3>
              <div className="space-y-2">
                {currentProtections.laws.map((law, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{law}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0d9488]" />
                Your Protections
              </h3>
              <div className="space-y-2">
                {currentProtections.protections.map((protection, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{protection}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Platform Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Platform</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Appeal Process</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Response Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Typical Response</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Min Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Min Completion</th>
                </tr>
              </thead>
              <tbody>
                {platformComparison.map((platform, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${platform.color} rounded-lg`}></div>
                        <span className="font-medium text-slate-800">{platform.platform}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-medium capitalize ${getProcessColor(platform.appealProcess)}`}>
                        {platform.appealProcess}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{platform.responseTime}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-[#0d9488] h-2 rounded-full"
                            style={{ width: `${platform.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{platform.successRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{platform.minRating}</td>
                    <td className="py-4 px-4 text-slate-700">{platform.minCompletion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            Warning Signs (Red Flags)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {redFlags.map((flag, index) => {
              const Icon = flag.icon;
              return (
                <div
                  key={index}
                  className={`p-4 border-l-4 rounded-lg ${getSeverityColor(flag.severity)}`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Icon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{flag.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{flag.description}</p>
                      <div className="flex items-start gap-2 mt-3 p-2 bg-white rounded">
                        <Info className="w-4 h-4 text-[#0d9488] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-700">
                          <span className="font-semibold">Action:</span> {flag.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proactive Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-green-600" />
            Proactive Tips to Protect Your Account
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {proactiveTips.map((tipCategory, index) => {
              const Icon = tipCategory.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0d9488]/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#0d9488]" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">{tipCategory.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {tipCategory.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-sm text-slate-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('notice-analyzer')}
            className="bg-gradient-to-r from-[#0d9488] to-[#14b8a6] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Analyze My Notice
          </button>
          <button
            onClick={() => onNavigate('evidence-organizer')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Organize Evidence
          </button>
          <button
            onClick={() => onNavigate('chatbot')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Info className="w-5 h-5" />
            Ask Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
