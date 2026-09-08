import { Camera } from 'lucide-react';
import Button from '@/components/common/Button';

interface ProfileCardProps {
  name?: string;
  email?: string;
}

const ProfileCard = ({ name, email }: ProfileCardProps) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden
      animate-fade-in-up">
      {/* Cover */}
      <div className="h-28 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20" />
      </div>
      
      {/* Content */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-14 mb-5">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 
            flex items-center justify-center text-5xl font-bold text-white
            border-4 border-[#020617] shadow-2xl shadow-indigo-500/30">
            {name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-1 right-1 p-2.5 
            bg-slate-800 hover:bg-slate-700 border border-slate-700
            rounded-xl text-slate-300 hover:text-white
            transition-all duration-200 shadow-lg">
            <Camera size={16} />
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-white">{name || 'User'}</h2>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 
              rounded-md text-xs font-medium">
              Verified
            </span>
          </div>
          <p className="text-slate-400 text-sm">{email || 'user@example.com'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-800/30 rounded-xl text-center">
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-xs text-slate-500">Total Logins</p>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-xl text-center">
            <p className="text-2xl font-bold text-emerald-400">98%</p>
            <p className="text-xs text-slate-500">Security Score</p>
          </div>
        </div>

        {/* Edit Button */}
        <Button variant="secondary" fullWidth>
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
