import { Eye } from 'lucide-react';

interface ProfileCardProps {
  name?: string;
  email?: string;
}

const ProfileCard = ({ name, email }: ProfileCardProps) => {
  return (
    <div
      className="lg:col-span-3 bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-transparent
        border border-indigo-500/20 rounded-2xl p-6 sm:p-8
        animate-fade-in-up animation-delay-600"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 
            flex items-center justify-center text-3xl font-bold text-white
            shadow-xl shadow-indigo-500/30"
        >
          {name?.charAt(0).toUpperCase() || 'U'}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-xl font-semibold text-white">{name || 'User'}</h4>
            <span
              className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 
                rounded-full text-xs font-medium flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Active
            </span>
          </div>
          <p className="text-slate-400">{email || 'user@example.com'}</p>
        </div>

        {/* Action */}
        <button
          className="flex items-center gap-2 px-5 py-2.5
            bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50
            text-white text-sm font-medium rounded-xl
            transition-all duration-200"
        >
          <Eye size={16} />
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
