import { useAuth } from '@/hooks/useAuth';
import ProfileCard from './ProfileCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import StatsGrid from './StatsGrid';
import WelcomeSection from './WelcomeSection';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main className="lg:ml-72 pt-16">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <WelcomeSection userName={user?.name} />
        <StatsGrid />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickActions />
          <RecentActivity />
          <ProfileCard name={user?.name} email={user?.email} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
