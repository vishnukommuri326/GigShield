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
  X
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
      className={`bg-[#1e3a5f] text-white h-screen transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col shadow-xl`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#0d9488]" />
            <span className="text-xl font-bold">GigShield</span>
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
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive 
                  ? 'bg-[#0d9488] text-white shadow-lg' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 space-y-3">
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          )}
          <p className="text-xs text-white/50 text-center">
            © 2026 GigShield
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
