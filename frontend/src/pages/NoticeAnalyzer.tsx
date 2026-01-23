import { Upload, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface NoticeAnalyzerProps {
  onNavigate: (page: string) => void;
}

const NoticeAnalyzer = ({ onNavigate }: NoticeAnalyzerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Notice Analyzer
          </h1>
          <p className="text-lg text-slate-600">
            Upload your deactivation notice and get instant analysis
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
              className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent resize-none"
              placeholder="Paste your deactivation notice here..."
            />
          </div>

          <button className="mt-4 w-full py-4 bg-gradient-to-r from-[#1e3a5f] to-[#0d9488] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
            Analyze Notice
          </button>
        </div>

        {/* Analysis Results (placeholder) */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <AlertCircle className="w-10 h-10 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Reason Detected</h3>
            <p className="text-slate-600">Customer complaint - delivery issue</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <XCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Appeal Deadline</h3>
            <p className="text-slate-600">3 days remaining</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Success Rate</h3>
            <p className="text-slate-600">68% for similar cases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeAnalyzer;
