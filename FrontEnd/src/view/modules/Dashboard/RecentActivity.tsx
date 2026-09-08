import { Activity, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

interface ActivityItem {
  action: string;
  user: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

const recentActivity: ActivityItem[] = [
  { action: 'New user registered', user: 'john@example.com', time: '2 min ago', type: 'success' },
  { action: 'Password changed', user: 'sarah@example.com', time: '15 min ago', type: 'success' },
  { action: 'Failed login attempt', user: 'unknown@test.com', time: '32 min ago', type: 'warning' },
  { action: 'Profile updated', user: 'mike@example.com', time: '1 hour ago', type: 'info' },
  { action: '2FA enabled', user: 'emma@example.com', time: '2 hours ago', type: 'success' },
];

const TYPE_STYLES = {
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  info: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
} as const;

const ActivityRow = ({ item }: { item: ActivityItem }) => {
  const styles = TYPE_STYLES[item.type];

  return (
    <div
      className="flex items-center justify-between p-4 
        hover:bg-slate-800/30 rounded-xl 
        transition-colors duration-200 group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${styles.bg}`}>
          <CheckCircle2 size={18} className={styles.text} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            {item.action}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{item.user}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Clock size={14} />
        {item.time}
      </div>
    </div>
  );
};

const RecentActivity = () => {
  return (
    <div
      className="lg:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6
        animate-fade-in-up animation-delay-500"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity size={20} className="text-indigo-400" />
          Recent Activity
        </h3>
        <button
          className="text-sm text-indigo-400 hover:text-indigo-300 
            font-medium flex items-center gap-1 transition-colors"
        >
          View all
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {recentActivity.map((item, index) => (
          <ActivityRow key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
