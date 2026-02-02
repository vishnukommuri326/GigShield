import { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileEdit, 
  Shield,
  Search,
  FolderOpen,
  CheckCircle,
  BookMarked,
  User,
  Home,
  LogOut,
  X,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onClose?: () => void;
  onLogout?: () => void;
}

const Sidebar = ({ currentPage, onNavigate, onClose, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'landing', icon: Home, label: 'Home' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'wizard', icon: FileEdit, label: 'Appeal Wizard' },
    { id: 'analyzer', icon: Search, label: 'Notice Analyzer' },
    { id: 'tracker', icon: CheckCircle, label: 'Appeal Tracker' },
    { id: 'evidence', icon: FolderOpen, label: 'Evidence Organizer' },
    { id: 'insights', icon: MessageSquare, label: 'Policy Insights' },
    { id: 'knowledge', icon: BookMarked, label: 'Platform Data' },
    { id: 'account', icon: User, label: 'Account' },
  ];

  return (
    <div 
      className={`bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-[#1e293b] text-white h-screen transition-all duration-500 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      } flex flex-col shadow-2xl backdrop-blur-xl border-r border-white/5`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-[#0f172a]" />
            </div>
            <span className="text-xl font-bold tracking-tight">GigShield</span>
          </div>
        )}
        <button
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              setIsCollapsed(!isCollapsed);
            }
          }}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0f172a] shadow-lg shadow-[#d4af37]/20 scale-[1.02]' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`} />
              {!isCollapsed && <span className="font-semibold tracking-tight relative z-10">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 space-y-3 backdrop-blur-sm bg-white/5">
          {onLogout && (
            <button
              onClick={onLogout}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 hover:translate-x-1"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-tight">Logout</span>
            </button>
          )}
          <p className="text-xs text-white/40 text-center font-medium tracking-wide">
            © 2026 GigShield
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
