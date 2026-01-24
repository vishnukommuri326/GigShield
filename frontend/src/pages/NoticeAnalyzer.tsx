import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle, AlertTriangle, Info, TrendingUp, ArrowRight, Sparkles, FileText, Shield, Clock } from 'lucide-react';
import { analyzeNotice as analyzeNoticeAPI } from '../services/apiService';

interface NoticeAnalyzerProps {
  onNavigate: (page: string) => void;
}

interface AnalysisResult {
  platform: string;
  reason: string;
  category: string;
  deactivationDate: string;
  appealDeadline: string;
  daysRemaining: number;
  missingInfo: string[];
  riskLevel: 'easy' | 'moderate' | 'difficult';
  successRate: number;
  extracted: boolean;
}

const NoticeAnalyzer = ({ onNavigate }: NoticeAnalyzerProps) => {
  const [noticeText, setNoticeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  // Real API call to backend
  const analyzeNotice = async () => {
    if (!noticeText.trim()) {
      setError('Please enter your notice text');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      // Call real backend API
      const result = await analyzeNoticeAPI(noticeText);
      
      // Map API response to our component state
      const mappedResult: AnalysisResult = {
        platform: result.platform,
        reason: result.reason,
        category: result.urgency_level, // Using urgency as category for now
        deactivationDate: new Date().toISOString().split('T')[0],
        appealDeadline: result.deadline_days 
          ? new Date(Date.now() + result.deadline_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : '',
        daysRemaining: result.deadline_days || 30,
        missingInfo: result.missing_info,
        riskLevel: mapRiskLevel(result.risk_level),
        successRate: 68, // Mock for now
        extracted: true,
      };
      
      setAnalysisResult(mappedResult);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze notice. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mapRiskLevel = (level: string): 'easy' | 'moderate' | 'difficult' => {
    const lower = level.toLowerCase();
    if (lower.includes('low') || lower.includes('easy')) return 'easy';
    if (lower.includes('high') || lower.includes('difficult')) return 'difficult';
    return 'moderate';
  };

  const detectPlatform = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('doordash') || lower.includes('dasher')) return 'DoorDash';
    if (lower.includes('uber')) return 'Uber';
    if (lower.includes('lyft')) return 'Lyft';
    if (lower.includes('instacart')) return 'Instacart';
    if (lower.includes('amazon flex') || lower.includes('flex')) return 'Amazon Flex';
    if (lower.includes('shipt')) return 'Shipt';
    if (lower.includes('grubhub')) return 'Grubhub';
    return 'Unknown Platform';
  };

  const getRiskLevelInfo = (level: string) => {
    switch (level) {
      case 'easy':
        return { label: 'Easy', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-500' };
      case 'moderate':
        return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-500' };
      case 'difficult':
        return { label: 'Difficult', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-500' };
      default:
        return { label: 'Unknown', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-500' };
    }
  };

  const getUrgencyLevel = (days: number) => {
    if (days <= 7) return { label: 'URGENT', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    if (days <= 14) return { label: 'Soon', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    return { label: 'Good Time', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
  };

  const urgency = analysisResult ? getUrgencyLevel(analysisResult.daysRemaining) : null;
  const riskInfo = analysisResult ? getRiskLevelInfo(analysisResult.riskLevel) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Notice Analyzer
          </h1>
          <p className="text-lg text-slate-600">
            Upload your deactivation notice and get instant AI-powered analysis
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-[#0d9488] transition-colors cursor-pointer">
            <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Upload Your Deactivation Notice
            </h3>
            <p className="text-slate-500 mb-4">
              Drop your PDF, image, or screenshot here, or click to browse
            </p>
            <button className="px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors">
              Choose File
            </button>
          </div>

          {/* Or Paste Text */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Or paste the notice text
            </label>
            <textarea
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent resize-none"
              placeholder="Paste your deactivation notice here..."
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <button 
            onClick={analyzeNotice}
            disabled={!noticeText.trim() || isAnalyzing}
            className="mt-4 w-full py-4 bg-gradient-to-r from-[#1e3a5f] to-[#0d9488] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Notice
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Urgency Banner */}
            {urgency && (
              <div className={`${urgency.bg} border-2 border-${urgency.color.replace('text-', '')} rounded-2xl p-6`}>
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = urgency.icon;
                    return <Icon className={`w-12 h-12 ${urgency.color}`} />;
                  })()}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-sm font-bold uppercase ${urgency.color}`}>{urgency.label}</span>
                      <span className="text-2xl font-bold text-slate-900">{analysisResult.daysRemaining} days remaining</span>
                    </div>
                    <p className="text-slate-700">
                      Appeal deadline: <span className="font-semibold">{new Date(analysisResult.appealDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('wizard')}
                    className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold flex items-center gap-2"
                  >
                    Start Appeal Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Key Findings */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <Shield className="w-10 h-10 text-blue-500 mb-3" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Platform Detected</h3>
                <p className="text-2xl font-bold text-blue-600">{analysisResult.platform}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <FileText className="w-10 h-10 text-purple-500 mb-3" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Deactivation Category</h3>
                <p className="text-lg font-bold text-purple-600">{analysisResult.category}</p>
              </div>

              {riskInfo && (
                <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${riskInfo.border}`}>
                  <TrendingUp className={`w-10 h-10 ${riskInfo.color} mb-3`} />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Appeal Difficulty</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${riskInfo.color}`}>{riskInfo.label}</span>
                    <span className="text-slate-600">({analysisResult.successRate}% success)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                <Info className="w-7 h-7" />
                Analysis Summary
              </h2>

              <div className="space-y-6">
                {/* What We Found */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">What We Found:</h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-700">Platform: </span>
                        <span className="text-slate-900">{analysisResult.platform}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-700">Stated Reason: </span>
                        <span className="text-slate-900">"{analysisResult.reason}"</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-700">Category: </span>
                        <span className="text-slate-900">{analysisResult.category}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-700">Deactivation Date: </span>
                        <span className="text-slate-900">{new Date(analysisResult.deactivationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Missing Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Missing Information
                  </h3>
                  <p className="text-slate-600 mb-3">
                    The platform should have provided the following information but didn't:
                  </p>
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 space-y-2">
                    {analysisResult.missingInfo.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 mt-3 italic">
                    💡 Your appeal should request this missing information to strengthen your case.
                  </p>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Recommended Next Steps:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                      <div>
                        <p className="font-medium text-slate-900">Start your appeal now</p>
                        <p className="text-sm text-slate-600">You have {analysisResult.daysRemaining} days remaining - don't wait!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                      <div>
                        <p className="font-medium text-slate-900">Gather evidence</p>
                        <p className="text-sm text-slate-600">Visit the Evidence Organizer to see what documentation you need</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                      <div>
                        <p className="font-medium text-slate-900">Request missing information</p>
                        <p className="text-sm text-slate-600">Your appeal letter will demand the platform provide what they left out</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('wizard')}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Generate Appeal Letter
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => onNavigate('evidence')}
                className="flex-1 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all"
              >
                Organize Evidence
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="flex-1 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Ask Questions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeAnalyzer;
