import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  FileEdit, 
  Camera, 
  BookOpen,
  Menu,
  X,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analyzer', icon: FileText, label: 'Lease Analyzer' },
    { id: 'chat', icon: MessageSquare, label: 'Rights Chat' },
    { id: 'letters', icon: FileEdit, label: 'Letter Generator' },
    { id: 'evidence', icon: Camera, label: 'Evidence Logger' },
    { id: 'resources', icon: BookOpen, label: 'Resources' },
  ];

  return (
    <div 
      className={`bg-[#1e3a5f] text-white h-screen fixed left-0 top-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col shadow-xl z-50`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#0d9488]" />
            <span className="text-xl font-bold">RentShield</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
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
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            © 2026 RentShield
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
