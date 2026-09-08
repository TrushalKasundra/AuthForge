import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield } from 'lucide-react';
import { Navigate, Outlet } from 'react-router';

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="p-4 gradient-primary rounded-2xl shadow-xl shadow-indigo-500/30 animate-pulse">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
