import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, MinusCircle, Loader2 } from 'lucide-react';

interface AnalyticsDashboardProps {
  onNavigate: (page: string) => void;
}

interface CaseData {
  platform: string;
  total: number;
  approved: number;
  denied: number;
  pending: number;
  avgResponseDays: number;
  medianResponseDays: number;
}

interface ReasonData {
  category: string;
  count: number;
  percentage: number;
}

interface AnalyticsResponse {
  summary: {
    totalCases: number;
    totalApproved: number;
    totalDenied: number;
    totalPending: number;
    simulatedCount: number;
    dataSource: 'simulated' | 'real' | 'mixed';
  };
  casesByPlatform: { [key: string]: number };
  outcomesByPlatform: {
    [key: string]: {
      approved: number;
      denied: number;
      pending: number;
    };
  };
  avgResponseTimeDays: { [key: string]: number };
  medianResponseTimeDays: { [key: string]: number };
  responseTimeBuckets: { [key: string]: number };
  reasonDistribution: { [key: string]: number };
}

const AnalyticsDashboard = ({ onNavigate }: AnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:8000/api/analytics/overview');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800 text-center font-semibold mb-2">Failed to load analytics</p>
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform API data into component format
  const casesByPlatform: CaseData[] = Object.entries(analytics.casesByPlatform).map(([platform, total]) => ({
    platform,
    total,
    approved: analytics.outcomesByPlatform[platform]?.approved || 0,
    denied: analytics.outcomesByPlatform[platform]?.denied || 0,
    pending: analytics.outcomesByPlatform[platform]?.pending || 0,
    avgResponseDays: analytics.avgResponseTimeDays[platform] || 0,
    medianResponseDays: analytics.medianResponseTimeDays[platform] || 0,
  })).sort((a, b) => b.total - a.total);

  const totalCases = analytics.summary.totalCases;
  const reasonCategories: ReasonData[] = Object.entries(analytics.reasonDistribution).map(([category, count]) => ({
    category,
    count,
    percentage: (count / totalCases) * 100,
  })).sort((a, b) => b.count - a.count);

  const responseTimeBuckets = Object.entries(analytics.responseTimeBuckets).map(([range, count]) => ({
    range,
    count,
  }));

  const totalApproved = analytics.summary.totalApproved;
  const totalDenied = analytics.summary.totalDenied;
  const totalPending = analytics.summary.totalPending;

  const getApprovalRate = (approved: number, denied: number) => {
    const total = approved + denied;
    if (total < 5) return 'N/A'; // Don't show percentage for small samples
    return `${Math.round((approved / total) * 100)}%`;
  };

  const maxCases = Math.max(...casesByPlatform.map(p => p.total));
  const maxResponseTime = Math.max(...responseTimeBuckets.map(b => b.count));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Aggregated patterns across platform enforcement decisions
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 text-sm">Total Cases</p>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalCases}</p>
            <p className="text-xs text-slate-500 mt-1">Across {casesByPlatform.length} platforms</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 text-sm">Approved</p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{totalApproved}</p>
            <p className="text-xs text-slate-500 mt-1">{getApprovalRate(totalApproved, totalDenied)} approval rate</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 text-sm">Denied</p>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{totalDenied}</p>
            <p className="text-xs text-slate-500 mt-1">{Math.round((totalDenied / (totalApproved + totalDenied)) * 100)}% of resolved</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 text-sm">Pending</p>
              <MinusCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{totalPending}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting response</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* 1. Cases by Platform */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Cases by Platform
            </h2>
            <div className="space-y-4">
              {casesByPlatform.map((platform) => (
                <div key={platform.platform}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-700">{platform.platform}</span>
                    <span className="text-slate-900 font-bold">{platform.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${(platform.total / maxCases) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Outcomes by Platform */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Outcomes by Platform
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Platform</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-green-700">Approved</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-red-700">Denied</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-yellow-700">Pending</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {casesByPlatform.map((platform) => (
                    <tr key={platform.platform} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2 font-medium text-slate-800">{platform.platform}</td>
                      <td className="py-3 px-2 text-center text-green-600">{platform.approved}</td>
                      <td className="py-3 px-2 text-center text-red-600">{platform.denied}</td>
                      <td className="py-3 px-2 text-center text-yellow-600">{platform.pending}</td>
                      <td className="py-3 px-2 text-center text-slate-700 font-semibold">
                        {getApprovalRate(platform.approved, platform.denied)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              * Approval rate shown only when approved + denied ≥ 5 cases
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* 3. Time to Response */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Time to Response Distribution
            </h2>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-semibold mb-1">Average</p>
                <p className="text-2xl font-bold text-blue-900">
                  {(casesByPlatform.reduce((sum, p) => sum + p.avgResponseDays * p.total, 0) / totalCases).toFixed(1)} days
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-700 font-semibold mb-1">Median</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {(casesByPlatform.reduce((sum, p) => sum + p.medianResponseDays * p.total, 0) / totalCases).toFixed(1)} days
                </p>
              </div>
            </div>

            {/* Histogram */}
            <div className="space-y-3">
              {responseTimeBuckets.map((bucket) => (
                <div key={bucket.range}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{bucket.range}</span>
                    <span className="text-sm text-slate-600">{bucket.count} cases</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(bucket.count / maxResponseTime) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Reason Category Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Deactivation Reason Distribution
            </h2>
            <div className="space-y-4">
              {reasonCategories.map((reason, index) => {
                const colors = [
                  { bar: 'from-red-400 to-red-600', text: 'text-red-700', bg: 'bg-red-50' },
                  { bar: 'from-orange-400 to-orange-600', text: 'text-orange-700', bg: 'bg-orange-50' },
                  { bar: 'from-yellow-400 to-yellow-600', text: 'text-yellow-700', bg: 'bg-yellow-50' },
                  { bar: 'from-blue-400 to-blue-600', text: 'text-blue-700', bg: 'bg-blue-50' },
                  { bar: 'from-slate-400 to-slate-600', text: 'text-slate-700', bg: 'bg-slate-50' },
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={reason.category} className={`p-4 rounded-lg ${color.bg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${color.text}`}>{reason.category}</span>
                      <div className="text-right">
                        <span className={`font-bold ${color.text}`}>{reason.count}</span>
                        <span className="text-slate-600 text-sm ml-2">({reason.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${color.bar} h-2 rounded-full`}
                        style={{ width: `${reason.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              "Unknown" category reflects cases where specific reason was unclear or not disclosed
            </p>
          </div>
        </div>

        {/* Platform Response Time Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">
            Average Response Time by Platform
          </h2>
          <div className="space-y-3">
            {casesByPlatform
              .sort((a, b) => a.avgResponseDays - b.avgResponseDays)
              .map((platform) => (
                <div key={platform.platform} className="flex items-center gap-4">
                  <div className="w-32 font-semibold text-slate-700">{platform.platform}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full ${
                            platform.avgResponseDays < 7
                              ? 'bg-green-500'
                              : platform.avgResponseDays < 10
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${(platform.avgResponseDays / 20) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-20 text-right">
                        <span className="font-bold text-slate-900">{platform.avgResponseDays.toFixed(1)}</span>
                        <span className="text-slate-600 text-sm ml-1">days</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 ml-1">
                      Median: {platform.medianResponseDays} days
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Data Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-amber-900 mb-2">About This Data</p>
              <p className="text-sm text-amber-800 leading-relaxed mb-2">
                {analytics.summary.dataSource === 'simulated' && (
                  <>This dashboard displays <strong>simulated data</strong> ({analytics.summary.simulatedCount} cases) to demonstrate aggregation capabilities. Real-world patterns vary significantly by platform, region, and case specifics.</>
                )}
                {analytics.summary.dataSource === 'real' && (
                  <>This dashboard displays real case data ({totalCases} cases). Patterns vary by platform, region, and individual circumstances.</>
                )}
                {analytics.summary.dataSource === 'mixed' && (
                  <>This dashboard displays a mix of real ({totalCases - analytics.summary.simulatedCount} cases) and simulated ({analytics.summary.simulatedCount} cases) data. All simulated cases are marked in the database for transparency.</>
                )}
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                These visualizations illustrate system capabilities for analyzing enforcement patterns across platforms, not guarantees of individual case outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
