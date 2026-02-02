import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppealWizard from './pages/AppealWizard';
import NoticeAnalyzer from './pages/NoticeAnalyzer';
import AppealTracker from './pages/AppealTracker';
import EvidenceOrganizer from './pages/EvidenceOrganizer';
import InsightsExplorer from './pages/InsightsExplorer';
import KnowledgeBase from './pages/KnowledgeBase';
import PolicyInsights from './pages/PolicyInsights';
import Account from './pages/Account';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import { useAuth } from './hooks/useAuths';
import { logout as firebaseLogout } from './services/authService';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, loading } = useAuth();
  const [analyzerData, setAnalyzerData] = useState<any>(null);

  // Always logout when app mounts (fresh page load or browser open)
  useEffect(() => {
    const handlePageLoad = async () => {
      await firebaseLogout();
    };
    handlePageLoad();
    
    // Cleanup: logout when page closes/unmounts
    return () => {
      firebaseLogout();
    };
  }, []);

  // Redirect logic: logged in users go to landing (home), logged out users go to login
  useEffect(() => {
    if (user && ['login', 'signup'].includes(currentPage)) {
      setCurrentPage('landing');
    } else if (!user && !loading && !['login', 'signup'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, loading]);

  const handleLogin = (email: string) => {
    // Firebase auth is already handled, just navigate
    setCurrentPage('landing');
  };

  const handleSignup = (email: string, name: string) => {
    // Firebase auth is already handled, just navigate
    setCurrentPage('landing');
  };

  const handleLogout = async () => {
    await firebaseLogout();
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'signup':
        return <Signup onNavigate={setCurrentPage} onSignup={handleSignup} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsDashboard onNavigate={setCurrentPage} />;
      case 'wizard':
        return <AppealWizard onNavigate={setCurrentPage} prefilledData={analyzerData} />;
      case 'analyzer':
      case 'notice-analyzer':
        return <NoticeAnalyzer onNavigate={setCurrentPage} onAnalysisComplete={setAnalyzerData} />;
      case 'tracker':
      case 'appeal-tracker':
        return <AppealTracker onNavigate={setCurrentPage} />;
      case 'evidence':
      case 'evidence-organizer':
        return <EvidenceOrganizer onNavigate={setCurrentPage} />;
      case 'chat':
      case 'chatbot':
      case 'insights':
        return <InsightsExplorer onNavigate={setCurrentPage} />;
      case 'knowledge':
      case 'knowledge-base':
        return <KnowledgeBase onNavigate={setCurrentPage} />;
      case 'policy-insights':
        return <PolicyInsights onNavigate={setCurrentPage} />;
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

  const isAuthPage = ['login', 'signup'].includes(currentPage);
  const showSidebar = !isAuthPage && !!user;

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d9488] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Floating Menu Button - Only show when not on auth pages */}
      {showSidebar && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-6 left-6 z-[100] p-3 bg-[#1e3a5f] text-white rounded-lg shadow-lg hover:bg-[#1e3a5f]/90 transition-all hover:scale-110"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Backdrop - Only visible when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Overlay on all pages except auth */}
      {isSidebarOpen && showSidebar && (
        <div className="fixed top-0 left-0 h-screen z-50 transition-transform duration-300">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${showSidebar && isSidebarOpen ? 'ml-64' : ''}`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;