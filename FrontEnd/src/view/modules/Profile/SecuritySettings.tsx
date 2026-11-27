import { useState } from 'react';
import { Key, Lock, ChevronRight, LogOut } from 'lucide-react';
import { useLogoutAllMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { logout as logoutAction } from '@/store/slices/authSlice';

const SecuritySettings = () => {
  const dispatch = useAppDispatch();
  const [logoutAll, { isLoading }] = useLogoutAllMutation();
  const [error, setError] = useState<string | null>(null);

  const handleLogoutAll = async () => {
    setError(null);
    try {
      await logoutAll().unwrap();
      dispatch(logoutAction());
    } catch {
      setError('Failed to sign out of all devices. Please try again.');
    }
  };

  return (
    <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6
      animate-fade-in-up animation-delay-400">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Lock size={20} className="text-indigo-400" />
        Security Settings
      </h3>

      <div className="flex flex-col gap-3">
        {/* Change Password */}
        <div className="flex items-center justify-between p-5
          bg-slate-800/30 hover:bg-slate-800/50 rounded-xl
          border border-slate-700/30 hover:border-slate-600/50
          transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Key size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-medium group-hover:text-indigo-300
                transition-colors flex items-center gap-2">
                Change Password
              </p>
              <p className="text-sm text-slate-500 mt-0.5">Update your account password</p>
            </div>
          </div>
          <button className="flex items-center gap-1 px-4 py-2
            bg-slate-700/50 hover:bg-indigo-600
            text-sm font-medium text-white rounded-lg
            transition-all duration-200">
            Update
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Sign Out All Devices */}
        <div className="flex items-center justify-between p-5
          bg-slate-800/30 hover:bg-slate-800/50 rounded-xl
          border border-slate-700/30 hover:border-slate-600/50
          transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <LogOut size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white font-medium group-hover:text-indigo-300
                transition-colors flex items-center gap-2">
                Sign Out All Devices
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                Revoke all active sessions including this one
              </p>
            </div>
          </div>
          <button
            onClick={handleLogoutAll}
            disabled={isLoading}
            className="flex items-center gap-1 px-4 py-2
              bg-slate-700/50 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed
              text-sm font-medium text-white rounded-lg
              transition-all duration-200">
            {isLoading ? 'Signing out...' : 'Sign Out All'}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 px-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
