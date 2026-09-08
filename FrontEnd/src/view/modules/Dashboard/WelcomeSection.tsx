import { Zap } from 'lucide-react';

interface WelcomeSectionProps {
  userName?: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {getGreeting()}, {userName?.split(' ')[0] || 'User'} 👋
          </h1>
        </div>

        <button
          className="inline-flex items-center gap-2 px-5 py-2.5
            bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium
            rounded-xl shadow-lg shadow-indigo-500/25
            transition-all duration-200 hover:-translate-y-0.5"
        >
          <Zap size={16} />
          Quick Action
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
