import { COLOR_MAP } from '@/constants';
import {
  Users,
  Activity,
  Shield,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  color: keyof typeof COLOR_MAP;
}

const stats: StatItem[] = [
  {
    label: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    isPositive: true,
    icon: Users,
    color: 'indigo',
  },
  {
    label: 'Active Sessions',
    value: '1,234',
    change: '+8.2%',
    isPositive: true,
    icon: Activity,
    color: 'violet',
  },
  {
    label: 'Security Score',
    value: '98%',
    change: '+2.1%',
    isPositive: true,
    icon: Shield,
    color: 'emerald',
  },
  {
    label: 'Failed Logins',
    value: '23',
    change: '-15.3%',
    isPositive: true,
    icon: AlertTriangle,
    color: 'amber',
  },
];

const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => {
  const colors = COLOR_MAP[stat.color];

  return (
    <div
      className="group p-6 bg-slate-900/50 border border-slate-800/50 rounded-2xl
        hover:border-slate-700/50 hover:bg-slate-900/80
        transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <stat.icon size={20} className={colors.text} />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            stat.isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {stat.change}
        </div>
      </div>

      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
      <p className="text-sm text-slate-500">{stat.label}</p>
    </div>
  );
};

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </div>
  );
};

export default StatsGrid;
