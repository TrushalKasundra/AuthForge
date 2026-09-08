import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  User, 
  Shield, 
  Settings, 
  Bell, 
  HelpCircle,
  X,
  LogOut,
  Fingerprint,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/dashboard',
    description: 'Overview & analytics'
  },
  { 
    label: 'Profile', 
    icon: User, 
    path: '/profile',
    description: 'Your account info'
  },
  { 
    label: 'Security', 
    icon: Shield, 
    path: '/security',
    description: '2FA & sessions'
  },
  { 
    label: 'Notifications', 
    icon: Bell, 
    path: '/notifications',
    description: 'Alert preferences'
  },
  { 
    label: 'Settings', 
    icon: Settings, 
    path: '/settings',
    description: 'App configuration'
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden backdrop-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72
          bg-[#0a0f1c] border-r border-slate-800/50
          transform transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/50">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 
                flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Fingerprint size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Auth<span className="text-indigo-400">Vault</span>
              </span>
            </Link>

            {/* Close button - mobile only */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-white 
                hover:bg-slate-800/50 rounded-xl transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${active 
                      ? 'bg-indigo-500/10 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  {/* Active indicator */}
                  <div className={`
                    absolute left-0 w-1 h-8 rounded-r-full
                    transition-all duration-200
                    ${active ? 'bg-indigo-500' : 'bg-transparent'}
                  `} />
                  
                  {/* Icon */}
                  <div className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${active 
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-slate-500 group-hover:text-slate-300'
                    }
                  `}>
                    <item.icon size={18} />
                  </div>

                  {/* Label & Description */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${active ? 'text-white' : ''}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight 
                    size={16} 
                    className={`
                      transition-all duration-200
                      ${active 
                        ? 'text-indigo-400 opacity-100' 
                        : 'text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Help Card */}
          <div className="p-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 
              border border-indigo-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <HelpCircle size={18} className="text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-white">Need help?</p>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Check our documentation or contact support.
              </p>
              <button className="w-full py-2.5 text-sm font-medium text-indigo-400 
                bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl
                transition-colors duration-200">
                View Documentation
              </button>
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-slate-800/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 
                flex items-center justify-center text-white font-semibold
                shadow-lg shadow-indigo-500/20">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-400 
                  hover:bg-red-500/10 rounded-lg transition-all duration-200"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
