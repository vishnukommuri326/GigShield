import { Search, Book, FileText, Scale, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface KnowledgeBaseProps {
  onNavigate: (page: string) => void;
}

const KnowledgeBase = ({ onNavigate }: KnowledgeBaseProps) => {
  const platforms = [
    {
      name: 'DoorDash',
      articles: 12,
      color: 'bg-red-500',
    },
    {
      name: 'Uber',
      articles: 15,
      color: 'bg-black',
    },
    {
      name: 'Instacart',
      articles: 8,
      color: 'bg-green-500',
    },
    {
      name: 'Lyft',
      articles: 10,
      color: 'bg-pink-500',
    },
  ];

  const topics = [
    {
      icon: Scale,
      title: 'Your Legal Rights',
      description: 'Understand your rights as an independent contractor',
      articles: 8,
    },
    {
      icon: AlertCircle,
      title: 'Common Deactivation Reasons',
      description: 'Learn about the most common reasons for deactivation',
      articles: 12,
    },
    {
      icon: CheckCircle,
      title: 'Appeal Best Practices',
      description: 'Tips for writing successful appeal letters',
      articles: 6,
    },
    {
      icon: Shield,
      title: 'Preventing Deactivation',
      description: 'Proactive steps to protect your account',
      articles: 10,
    },
  ];

  const recentArticles = [
    {
      title: 'Understanding DoorDash\'s Customer Rating Policy',
      platform: 'DoorDash',
      views: 1234,
      helpful: 89,
    },
    {
      title: 'What to Do If You\'re Deactivated Without Warning',
      platform: 'All Platforms',
      views: 2156,
      helpful: 95,
    },
    {
      title: 'How to Appeal an Uber Deactivation Successfully',
      platform: 'Uber',
      views: 1890,
      helpful: 92,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Know Your Rights
          </h1>
          <p className="text-lg text-slate-600">
            Comprehensive knowledge base for gig worker rights and appeals
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles, policies, rights..."
              className="w-full pl-14 pr-4 py-4 border border-slate-300 rounded-xl text-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
            />
          </div>
        </div>

        {/* Platform Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Browse by Platform</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className={`w-12 h-12 ${platform.color} rounded-lg mb-3`}></div>
                <h3 className="font-semibold text-slate-800 mb-1">{platform.name}</h3>
                <p className="text-sm text-slate-600">{platform.articles} articles</p>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Popular Topics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.title}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#0d9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#0d9488]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{topic.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{topic.description}</p>
                      <p className="text-xs text-[#0d9488] font-medium">{topic.articles} articles</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Articles */}
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Most Helpful Articles</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {recentArticles.map((article, index) => (
              <div
                key={index}
                className="p-6 border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-2">{article.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        {article.platform}
                      </span>
                      <span>{article.views.toLocaleString()} views</span>
                      <span className="text-green-600">{article.helpful}% found helpful</span>
                    </div>
                  </div>
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
