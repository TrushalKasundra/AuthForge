import { COLOR_MAP } from '@/constants';
import { Mail, User, Calendar, Globe } from 'lucide-react';

interface AccountInfoProps {
  name?: string;
  email?: string;
  createdAt?: string;
}

const sessionInfo = [
  { label: 'IP Address', value: '192.168.1.XXX' },
  { label: 'Browser', value: 'Chrome 120' },
  { label: 'Location', value: 'Mumbai, India' },
  { label: 'Last Login', value: 'Today, 2:30 PM' },
];

const AccountInfo = ({ name, email, createdAt }: AccountInfoProps) => {
  const accountItems = [
    { icon: User, label: 'Full Name', value: name, color: 'indigo' },
    { icon: Mail, label: 'Email Address', value: email, color: 'violet' },
    { icon: Calendar, label: 'Member Since', value: createdAt 
      ? new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'N/A', color: 'cyan' },
    { icon: Globe, label: 'Account Status', value: 'Active', color: 'emerald', isStatus: true },
  ];

  return (
    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6
      animate-fade-in-up animation-delay-200">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <User size={20} className="text-indigo-400" />
        Account Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accountItems.map((item) => {
          const colors = COLOR_MAP[item.color as keyof typeof COLOR_MAP];
          return (
            <div key={item.label} 
              className="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 
                transition-colors duration-200 group">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <item.icon size={16} className={colors.text} />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <p className={`pl-10 font-medium ${
                item.isStatus ? 'text-emerald-400' : 'text-white'
              }`}>
                {item.value || 'N/A'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Session Info */}
      <div className="mt-6 pt-6 border-t border-slate-800/50">
        <h4 className="text-sm font-medium text-slate-400 mb-4">Current Session</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sessionInfo.map((item) => (
            <div key={item.label} className="p-3 bg-slate-800/20 rounded-xl text-center">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className="text-sm text-white font-medium truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
