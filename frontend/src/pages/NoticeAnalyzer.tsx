import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle, AlertTriangle, Info, TrendingUp, ArrowRight, Sparkles, FileText, Shield, Clock } from 'lucide-react';
import { analyzeNotice as analyzeNoticeAPI } from '../services/apiService';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface NoticeAnalyzerProps {
  onNavigate: (page: string) => void;
  onAnalysisComplete?: (data: any) => void;
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
  caseId?: string;
}

const NoticeAnalyzer = ({ onNavigate, onAnalysisComplete }: NoticeAnalyzerProps) => {
  const [noticeText, setNoticeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [caseScore, setCaseScore] = useState<any>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);

  // Real API call to backend
  const analyzeNotice = async (textToAnalyze?: string) => {
    const text = textToAnalyze || noticeText;
    if (!text.trim() && !uploadedFile) {
      setError('Please upload a file or enter your notice text');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      // Call real backend API
      const result = await analyzeNoticeAPI(text);
      
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

  // Fetch case score from backend
  const fetchCaseScore = async (caseId: string) => {
    setIsLoadingScore(true);
    try {
      const response = await fetch(`http://localhost:8000/api/cases/${caseId}/score`);
      if (!response.ok) {
        throw new Error('Failed to fetch score');
      }
      const scoreData = await response.json();
      setCaseScore(scoreData);
    } catch (err) {
      console.error('Error fetching score:', err);
    } finally {
      setIsLoadingScore(false);
    }
  };

  const mapRiskLevel = (level: string): 'easy' | 'moderate' | 'difficult' => {
    const lower = level.toLowerCase();
    if (lower.includes('low') || lower.includes('easy')) return 'easy';
    if (lower.includes('high') || lower.includes('difficult')) return 'difficult';
    return 'moderate';
  };

  // Explainable probability scoring (rule-based, not predictive)
  const calculateAppealLikelihood = (result: AnalysisResult | null) => {
    if (!result) return null;

    let score = 50; // Baseline
    const factors: Array<{ text: string; impact: number; positive: boolean }> = [];

    // Factor 1: Violation category
    const categoryLower = result.category.toLowerCase();
    if (categoryLower.includes('rating') || categoryLower.includes('performance')) {
      score += 15;
      factors.push({ text: 'Performance-based deactivation (typically reviewable)', impact: 15, positive: true });
    } else if (categoryLower.includes('safety') || categoryLower.includes('fraud')) {
      score -= 25;
      factors.push({ text: 'Safety/fraud flag (requires strong counter-evidence)', impact: -25, positive: false });
    } else if (categoryLower.includes('completion')) {
      score += 10;
      factors.push({ text: 'Completion rate issue (documentable)', impact: 10, positive: true });
    }

    // Factor 2: Missing information
    if (result.missingInfo.length === 0) {
      score += 20;
      factors.push({ text: 'All key information identified', impact: 20, positive: true });
    } else if (result.missingInfo.length > 3) {
      score -= 15;
      factors.push({ text: `${result.missingInfo.length} critical details unclear`, impact: -15, positive: false });
    } else {
      score -= 5;
      factors.push({ text: `${result.missingInfo.length} minor gaps in notice`, impact: -5, positive: false });
    }

    // Factor 3: Appeal timing
    if (result.daysRemaining > 14) {
      score += 10;
      factors.push({ text: 'Ample time to gather evidence', impact: 10, positive: true });
    } else if (result.daysRemaining < 3) {
      score -= 10;
      factors.push({ text: 'Very limited time to respond', impact: -10, positive: false });
    }

    // Factor 4: Platform (based on observed patterns)
    const platformLower = result.platform.toLowerCase();
    if (platformLower.includes('instacart')) {
      score += 8;
      factors.push({ text: 'Platform has structured appeal process', impact: 8, positive: true });
    } else if (platformLower.includes('amazon')) {
      score -= 12;
      factors.push({ text: 'Platform has historically limited review', impact: -12, positive: false });
    }

    // Clamp score to 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine likelihood band
    let likelihood: 'Low' | 'Medium' | 'High';
    let confidenceBand: string;
    let bandColor: string;

    if (score >= 65) {
      likelihood = 'High';
      confidenceBand = '65-85%';
      bandColor = 'text-green-700 bg-green-50 border-green-300';
    } else if (score >= 40) {
      likelihood = 'Medium';
      confidenceBand = '40-65%';
      bandColor = 'text-yellow-700 bg-yellow-50 border-yellow-300';
    } else {
      likelihood = 'Low';
      confidenceBand = '15-40%';
      bandColor = 'text-red-700 bg-red-50 border-red-300';
    }

    return {
      score,
      likelihood,
      confidenceBand,
      bandColor,
      factors
    };
  };

  const appealScore = calculateAppealLikelihood(analysisResult);

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

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload an image (JPG, PNG) or PDF file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setError('');

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setFilePreview('');
      // Try to extract text from PDF
      await extractPDFText(file);
    }
  };

  // Extract text from PDF
  const extractPDFText = async (file: File) => {
    setIsExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      // Set extracted text
      const extractedText = fullText.trim();
      if (!extractedText) {
        setError('PDF appears to be empty or contains only images. Please paste the text manually.');
        return;
      }
      
      console.log('PDF text extracted successfully, length:', extractedText.length);
      
      // Automatically analyze the extracted text (without showing it in the textarea)
      await analyzeNotice(extractedText);
    } catch (err: any) {
      console.error('PDF extraction error:', err);
      console.error('Error details:', err?.message, err?.name);
      setError(`Failed to extract text from PDF: ${err?.message || 'Unknown error'}. Please paste the text manually.`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Clear uploaded file
  const clearFile = () => {
    setUploadedFile(null);
    setFilePreview('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0f172a] mb-2">
            Notice Analyzer
          </h1>
          <p className="text-lg text-slate-600">
            Upload your deactivation notice and get instant AI-powered analysis
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-[#d4af37] transition-colors">
              <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Upload Your Deactivation Notice
              </h3>
              <p className="text-slate-500 mb-4">
                Drop your PDF, image, or screenshot here, or click to browse
              </p>
              <label className="inline-block px-6 py-3 bg-[#d4af37] text-white rounded-lg hover:bg-[#d4af37]/90 transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                Choose File
              </label>
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">File Uploaded</p>
                    <p className="text-sm text-green-700">{uploadedFile.name}</p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Remove
                </button>
              </div>
              {filePreview && (
                <div className="mt-4">
                  <img 
                    src={filePreview} 
                    alt="Deactivation notice preview" 
                    className="max-w-full h-auto rounded-lg border-2 border-green-200"
                  />
                </div>
              )}
              {uploadedFile.type === 'application/pdf' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    {isExtracting ? (
                      <>
                        <p className="font-medium mb-1">Extracting Text from PDF...</p>
                        <p>Please wait while we read your PDF file.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium mb-1">PDF Text Extracted Successfully</p>
                        <p>Text has been automatically extracted. Click "Analyze Notice" to continue.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Or Paste Text */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Or paste the notice text
            </label>
            <textarea
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent resize-none"
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
            onClick={() => analyzeNotice()}
            disabled={(!noticeText.trim() && !uploadedFile) || isAnalyzing}
            className="mt-4 w-full py-4 bg-[#0f172a] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            {/* Case Score Section - Only shown if we have a caseId */}
            {analysisResult.caseId && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border-2 border-indigo-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                    <Sparkles className="w-7 h-7" />
                    Case Strength Score
                  </h2>
                  {!caseScore && (
                    <button
                      onClick={() => fetchCaseScore(analysisResult.caseId!)}
                      disabled={isLoadingScore}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoadingScore ? 'Computing...' : 'Compute Score'}
                    </button>
                  )}
                </div>

                {caseScore && (
                  <div className="space-y-6">
                    {/* Score Display */}
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white shadow-lg">
                          <div className={`text-5xl font-bold ${
                            caseScore.label === 'high' ? 'text-green-600' :
                            caseScore.label === 'medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {caseScore.score}
                          </div>
                        </div>
                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                          caseScore.label === 'high' ? 'bg-green-600' :
                          caseScore.label === 'medium' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {caseScore.label.toUpperCase()}
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-lg text-indigo-900 mb-2">
                          This score is based on <strong>{caseScore.factors.length} weighted factors</strong> including violation category, evidence quality, and timing.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-indigo-700">
                          <Info className="w-4 h-4" />
                          <span>Score range: {caseScore.band[0]} to {caseScore.band[1]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Factors */}
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900 mb-4">Key Factors Affecting Your Score:</h3>
                      <div className="space-y-3">
                        {caseScore.factors.slice(0, 3).map((factor: any, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-slate-900">{factor.name}</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                factor.impact > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {factor.impact > 0 ? '+' : ''}{factor.impact}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{factor.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white/50 rounded-lg p-4 text-sm text-indigo-800">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="font-semibold">Category:</span> {caseScore.metadata.category}
                        </div>
                        <div>
                          <span className="font-semibold">Evidence:</span> {caseScore.metadata.evidenceCount} docs
                        </div>
                        <div>
                          <span className="font-semibold">Days since:</span> {caseScore.metadata.daysSinceDeactivation}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span> {caseScore.metadata.status}
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900">
                        <strong>Important:</strong> This score reflects case characteristics based on documented patterns, not a guarantee of outcome. Every appeal is reviewed individually by platform teams.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6 flex items-center gap-2">
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

                {/* Explainable Probability Scoring */}
                {appealScore && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Appeal Likelihood Assessment
                    </h3>
                    
                    {/* Likelihood Band */}
                    <div className={`border-2 rounded-xl p-6 mb-4 ${appealScore.bandColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold uppercase mb-1">Estimated Likelihood</p>
                          <p className="text-3xl font-bold">{appealScore.likelihood}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold mb-1">Confidence Band</p>
                          <p className="text-2xl font-bold">{appealScore.confidenceBand}</p>
                        </div>
                      </div>
                      
                      {/* Score Bar */}
                      <div className="relative">
                        <div className="w-full bg-white/50 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                            style={{ width: `${appealScore.score}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span>Low (0-40)</span>
                          <span>Medium (40-65)</span>
                          <span>High (65-100)</span>
                        </div>
                      </div>
                    </div>

                    {/* Factors Breakdown */}
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Factors Considered:</p>
                      {appealScore.factors.map((factor, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {factor.positive ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <span className="text-slate-800">{factor.text}</span>
                            <span className={`ml-2 text-sm font-semibold ${factor.positive ? 'text-green-700' : 'text-red-700'}`}>
                              ({factor.impact > 0 ? '+' : ''}{factor.impact} points)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-900 font-semibold mb-1">
                        ⚠️ This is NOT a prediction
                      </p>
                      <p className="text-sm text-blue-800">
                        This assessment uses rule-based logic to estimate relative appeal strength based on observed patterns. 
                        It is not a guarantee, legal advice, or statistical prediction of your specific outcome. 
                        Actual results depend on evidence quality, platform-specific processes, and case details.
                      </p>
                    </div>
                  </div>
                )}

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
                onClick={() => {
                  if (onAnalysisComplete && analysisResult) {
                    onAnalysisComplete({
                      platform: analysisResult.platform,
                      deactivationNotice: noticeText,
                      currentStep: 3,
                      reason: analysisResult.reason,
                      missingInfo: analysisResult.missingInfo,
                      deadlineDays: analysisResult.daysRemaining
                    });
                  }
                  onNavigate('wizard');
                }}
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
