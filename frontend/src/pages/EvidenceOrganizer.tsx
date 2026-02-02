import { useState, useEffect } from 'react';
import { Upload, FileText, Image, Trash2, Download, AlertCircle, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuths';
import { getMyAppeals } from '../services/apiService';

interface EvidenceOrganizerProps {
  onNavigate: (page: string) => void;
}

interface Appeal {
  id: string;
  platform: string;
  deactivationReason: string;
  status: string;
  createdAt: string;
}

interface EvidenceItem {
  id: string;
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  storagePath: string;
  caseId: string;
}

const EvidenceOrganizer = ({ onNavigate }: EvidenceOrganizerProps) => {
  const { user } = useAuth();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [selectedCase, setSelectedCase] = useState<Appeal | null>(null);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Load user's appeals on mount
  useEffect(() => {
    const loadAppeals = async () => {
      if (!user) return;
      
      try {
        const data = await getMyAppeals();
        setAppeals(data);
      } catch (err) {
        console.error('Error loading appeals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppeals();
  }, [user]);

  // Load evidence when case is selected
  useEffect(() => {
    const loadEvidence = async () => {
      if (!selectedCase || !user) return;
      
      try {
        const token = await user.getIdToken();
        const response = await fetch(`http://localhost:8000/api/cases/${selectedCase.id}/evidence`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Ensure we only set valid evidence items
          if (data.evidence && Array.isArray(data.evidence)) {
            setEvidenceItems(data.evidence);
          } else {
            console.error('Invalid evidence data format:', data);
            setEvidenceItems([]);
          }
        } else {
          console.error('Failed to load evidence:', response.status);
          setEvidenceItems([]);
        }
      } catch (err) {
        console.error('Error loading evidence:', err);
        setEvidenceItems([]);
      }
    };

    loadEvidence();
  }, [selectedCase, user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCase || !user) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only images (JPEG, PNG, WebP) and PDFs are allowed');
      return;
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setSuccessMessage('');

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('case_id', selectedCase.id);

      // Debug logging
      console.log('Uploading file:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        caseId: selectedCase.id
      });

      const response = await fetch('http://localhost:8000/api/upload-evidence', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to upload';
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        console.error('Upload error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setSuccessMessage('Evidence uploaded successfully!');
      
      // Reload evidence list
      const evidenceResponse = await fetch(`http://localhost:8000/api/cases/${selectedCase.id}/evidence`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (evidenceResponse.ok) {
        const data = await evidenceResponse.json();
        setEvidenceItems(data.evidence);
      }

      // Clear the file input
      event.target.value = '';
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this evidence?')) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:8000/api/evidence/${evidenceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete evidence');
      }

      // Remove from state
      setEvidenceItems(evidenceItems.filter(item => item.id !== evidenceId));
      setSuccessMessage('Evidence deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      setUploadError('Failed to delete evidence');
    }
  };

  const handleDownload = async (evidenceId: string, filename: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:8000/api/evidence/${evidenceId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const data = await response.json();
      
      // Open signed URL in new tab
      window.open(data.downloadUrl, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      setUploadError('Failed to download file');
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-green-500" />;
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // Case selection screen
  if (!selectedCase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#0f172a] mb-2">
              Evidence Organizer
            </h1>
            <p className="text-lg text-slate-600">
              Select a case to organize evidence
            </p>
          </div>

          {appeals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Cases Yet</h3>
              <p className="text-slate-600 mb-6">Create an appeal first to organize evidence</p>
              <button
                onClick={() => onNavigate('wizard')}
                className="px-6 py-3 bg-[#d4af37] text-white rounded-lg hover:bg-[#d4af37]/90 transition-colors"
              >
                Create Appeal
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {appeals.map((appeal) => (
                <button
                  key={appeal.id}
                  onClick={() => setSelectedCase(appeal)}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{appeal.platform}</h3>
                      <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                        {appeal.deactivationReason && appeal.deactivationReason.length < 200 
                          ? appeal.deactivationReason 
                          : appeal.deactivationReason?.substring(0, 200) + '...' || 'No reason provided'}
                      </p>
                      <p className="text-slate-500 text-xs">Created {formatDate(appeal.createdAt)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appeal.status === 'approved' ? 'bg-green-100 text-green-700' :
                      appeal.status === 'denied' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appeal.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Evidence management screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedCase(null)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cases</span>
          </button>
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Evidence for {selectedCase.platform}
          </h1>
          <p className="text-lg text-slate-600 line-clamp-2">
            {selectedCase.deactivationReason && selectedCase.deactivationReason.length < 200
              ? selectedCase.deactivationReason
              : selectedCase.deactivationReason?.substring(0, 200) + '...' || 'No reason provided'}
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-semibold">Security Notice</p>
            <p className="text-yellow-700 text-sm">
              Do not upload sensitive personal documents (SSN, bank statements, etc.). This tool is experimental. 
              Files are stored privately and require authentication to access. Maximum file size: 10MB. 
              Allowed types: Images (JPEG, PNG, WebP) and PDFs only.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-[#0f172a] mb-4">Upload Evidence</h2>
          
          {uploadError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600">{uploadError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-600">{successMessage}</p>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#d4af37] transition-colors">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-slate-500 text-sm mb-4">
              Images (JPEG, PNG, WebP) or PDF (max 10MB)
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`inline-block px-6 py-3 bg-[#d4af37] text-white rounded-lg hover:bg-[#d4af37]/90 transition-colors cursor-pointer ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Uploading...' : 'Select File'}
            </label>
          </div>
        </div>

        {/* Evidence List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
            Uploaded Evidence ({evidenceItems.length})
          </h2>

          {evidenceItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No evidence uploaded yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {evidenceItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getFileIcon(item.contentType)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {item.originalFilename || item.filename || 'Unknown File'}
                        </p>
                        <div className="flex gap-4 text-sm text-slate-500">
                          <span>{formatFileSize(item.size || 0)}</span>
                          <span>{item.uploadedAt ? formatDate(item.uploadedAt) : 'Unknown date'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(item.id, item.originalFilename || item.filename)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvidence(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceOrganizer;
