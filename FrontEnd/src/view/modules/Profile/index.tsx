import { useAuth } from '@/hooks/useAuth';
import AccountInfo from './AccountInfo';
import DangerZone from './DangerZone';
import ProfileCard from './ProfileCard';
import ProfileHeader from './ProfileHeader';
import SecuritySettings from './SecuritySettings';

const Profile = () => {
  const { user } = useAuth();

  return (
    <main className="lg:ml-72 pt-16">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileCard name={user?.name} email={user?.email} />
          <AccountInfo name={user?.name} email={user?.email} createdAt={user?.createdAt} />
          <SecuritySettings />
          <DangerZone />
        </div>
      </div>
    </main>
  );
};

export default Profile;
