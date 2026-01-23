import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AppealWizard from './pages/AppealWizard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'analyzer':
        return <AppealWizard onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  // Show landing page and wizard without sidebar
  if (currentPage === 'landing' || currentPage === 'analyzer') {
    return renderPage();
  }

  // Show authenticated pages with sidebar
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 ml-64 transition-all duration-300">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;