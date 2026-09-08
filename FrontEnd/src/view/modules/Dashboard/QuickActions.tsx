import { COLOR_MAP } from '@/constants';
import { Users, Shield, TrendingUp, Zap, type LucideIcon } from 'lucide-react';

interface QuickActionItem {
  label: string;
  icon: LucideIcon;
  color: keyof typeof COLOR_MAP;
}

const quickActions: QuickActionItem[] = [
  { label: 'Add User', icon: Users, color: 'indigo' },
  { label: 'Security Audit', icon: Shield, color: 'emerald' },
  { label: 'View Reports', icon: TrendingUp, color: 'violet' },
  { label: 'Quick Settings', icon: Zap, color: 'amber' },
];

const QuickActionButton = ({ action }: { action: QuickActionItem }) => {
  const colors = COLOR_MAP[action.color];

  return (
    <button
      className="flex flex-col items-center gap-3 p-4
        bg-slate-800/30 hover:bg-slate-800/60 
        border border-slate-700/30 hover:border-slate-600/50
        rounded-xl transition-all duration-200 group"
    >
      <div className={`p-3 rounded-xl ${colors.bg} group-hover:opacity-80 transition-colors`}>
        <action.icon size={20} className={colors.text} />
      </div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {action.label}
      </span>
    </button>
  );
};

const QuickActions = () => {
  return (
    <div
      className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6
        animate-fade-in-up animation-delay-400"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Zap size={20} className="text-amber-400" />
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <QuickActionButton key={action.label} action={action} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
