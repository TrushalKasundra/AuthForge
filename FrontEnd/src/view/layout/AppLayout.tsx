import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { STORAGE_KEYS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const navigation = useNavigation();

  // const isNavigating = navigation.state === 'loading';

   useEffect(()=>{
    const storageFunction = (e:StorageEvent): void => {
      if(e.key === STORAGE_KEYS.ACCESS_TOKEN && e.newValue !== e.oldValue){
        window.location.reload();
      }
    }
    window.addEventListener('storage',storageFunction)

    return ()=> {
      window.removeEventListener('storage',storageFunction)
    }
  },[])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="p-4 gradient-primary rounded-2xl shadow-xl shadow-indigo-500/30 animate-pulse">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-gray-400 text-sm">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated ) {
    return <Navigate to="/" replace />;
  }

  return <div className="min-h-screen bg-[#020617]">
    <Navbar onMenuClick={() => setSidebarOpen(true)} />
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <Outlet />
  </div>;
};
 
export default AppLayout;
