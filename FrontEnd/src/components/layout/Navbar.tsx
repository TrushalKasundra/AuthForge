import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16">
      {/* Glass background */}
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50" />
      
      <nav className="relative h-full lg:ml-72 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white 
              hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center">
            <div className={`
              relative flex items-center transition-all duration-300
              ${showSearch ? 'w-80' : 'w-64'}
            `}>
              <Search size={18} className="absolute left-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                onFocus={() => setShowSearch(true)}
                onBlur={() => setShowSearch(false)}
                className="w-full h-10 pl-11 pr-4
                  bg-slate-800/50 border border-slate-700/50 rounded-xl
                  text-slate-200 text-sm placeholder:text-slate-500
                  focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10
                  transition-all duration-200"
              />
              <kbd className="absolute right-3 hidden lg:flex items-center gap-1 
                px-2 py-0.5 rounded-md bg-slate-700/50 text-[10px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          
          {/* Mobile search button */}
          <button
            className="sm:hidden p-2.5 text-slate-400 hover:text-white 
              hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button
            className="relative p-2.5 text-slate-400 hover:text-white 
              hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#020617]" />
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-slate-700/50 mx-2" />

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1.5 pr-3 
                hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 
                flex items-center justify-center text-white text-sm font-semibold
                shadow-lg shadow-indigo-500/25">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {/* Name - hidden on mobile */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-200 leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 leading-tight">
                  {user?.email?.split('@')[0] || 'user'}
                </p>
              </div>
              
              <ChevronDown 
                size={16} 
                className={`hidden sm:block text-slate-500 transition-transform duration-200 
                  ${showDropdown ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-64 py-2
                  bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 
                  rounded-2xl shadow-2xl shadow-black/40
                  animate-fade-in-down"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-700/50">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 
                      text-slate-300 hover:text-white hover:bg-slate-700/50
                      transition-colors"
                  >
                    <User size={18} className="text-slate-400" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 
                      text-slate-300 hover:text-white hover:bg-slate-700/50
                      transition-colors"
                  >
                    <Settings size={18} className="text-slate-400" />
                    <span className="text-sm">Settings</span>
                  </Link>
                  
                  <Link
                    to="/security"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 
                      text-slate-300 hover:text-white hover:bg-slate-700/50
                      transition-colors"
                  >
                    <Shield size={18} className="text-slate-400" />
                    <span className="text-sm">Security</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-700/50 pt-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 
                      text-red-400 hover:text-red-300 hover:bg-red-500/10
                      transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
