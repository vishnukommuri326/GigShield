import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AppealWizard from './pages/AppealWizard';
import NoticeAnalyzer from './pages/NoticeAnalyzer';
import AppealTracker from './pages/AppealTracker';
import EvidenceOrganizer from './pages/EvidenceOrganizer';
import RightsChatbot from './pages/RightsChatbot';
import KnowledgeBase from './pages/KnowledgeBase';
import Account from './pages/Account';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'wizard':
        return <AppealWizard onNavigate={setCurrentPage} />;
      case 'analyzer':
        return <NoticeAnalyzer onNavigate={setCurrentPage} />;
      case 'tracker':
        return <AppealTracker onNavigate={setCurrentPage} />;
      case 'evidence':
        return <EvidenceOrganizer onNavigate={setCurrentPage} />;
      case 'chat':
        return <RightsChatbot onNavigate={setCurrentPage} />;
      case 'knowledge':
        return <KnowledgeBase onNavigate={setCurrentPage} />;
      case 'account':
        return <Account onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const isAuthPage = !['landing', 'wizard'].includes(currentPage);

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Floating Menu Button - Always Visible */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 left-6 z-[100] p-3 bg-[#1e3a5f] text-white rounded-lg shadow-lg hover:bg-[#1e3a5f]/90 transition-all hover:scale-110"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop - Only visible when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Overlay on all pages */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 h-screen z-50 transition-transform duration-300">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isAuthPage && isSidebarOpen ? 'ml-64' : ''}`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;