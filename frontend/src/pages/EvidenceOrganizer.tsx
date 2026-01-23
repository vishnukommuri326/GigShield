import { Upload, FileText, Image, Video, Trash2, FolderPlus, Download } from 'lucide-react';

interface EvidenceOrganizerProps {
  onNavigate: (page: string) => void;
}

const EvidenceOrganizer = ({ onNavigate }: EvidenceOrganizerProps) => {
  const evidenceItems = [
    {
      id: 1,
      name: 'delivery_screenshot.png',
      type: 'image',
      size: '2.4 MB',
      uploadDate: '2026-01-20',
      tags: ['delivery proof', 'timestamp'],
    },
    {
      id: 2,
      name: 'customer_message.pdf',
      type: 'document',
      size: '156 KB',
      uploadDate: '2026-01-20',
      tags: ['communication', 'customer'],
    },
    {
      id: 3,
      name: 'gps_route.png',
      type: 'image',
      size: '1.8 MB',
      uploadDate: '2026-01-19',
      tags: ['gps', 'route proof'],
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
              Evidence Organizer
            </h1>
            <p className="text-lg text-slate-600">
              Store and organize all your appeal evidence in one place
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors">
            <FolderPlus className="w-5 h-5" />
            New Folder
          </button>
        </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-[#0d9488] transition-colors cursor-pointer">
            <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Upload Evidence
            </h3>
            <p className="text-slate-500 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Supports: Images, PDFs, Videos, Screenshots, GPS Data
            </p>
            <button className="px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors">
              Choose Files
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Total Files</p>
            <p className="text-3xl font-bold text-[#1e3a5f]">12</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Storage Used</p>
            <p className="text-3xl font-bold text-[#0d9488]">48 MB</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Images</p>
            <p className="text-3xl font-bold text-blue-600">8</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-slate-600 text-sm mb-1">Documents</p>
            <p className="text-3xl font-bold text-green-600">4</p>
          </div>
        </div>

        {/* Evidence List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">Your Evidence Files</h2>
          <div className="space-y-4">
            {evidenceItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-[#0d9488] hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  {getFileIcon(item.type)}
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>Uploaded {item.uploadDate}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-[#0d9488]/10 text-[#0d9488] text-xs rounded-full">
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
