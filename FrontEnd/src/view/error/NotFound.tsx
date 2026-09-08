import { Link } from 'react-router';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '@/components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative text-center max-w-lg mx-auto animate-fade-in-up">
        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-bold leading-none
            bg-gradient-to-b from-slate-700 to-slate-900 bg-clip-text text-transparent
            select-none">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Page not found
        </h2>
        <p className="text-slate-400 mb-10 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or doesn't exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" leftIcon={<Home size={18} />}>
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" size="lg" leftIcon={<ArrowLeft size={18} />}>
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Search suggestion */}
        <div className="mt-12 pt-8 border-t border-slate-800/50">
          <p className="text-sm text-slate-500 mb-4">Or try searching for what you need</p>
          <div className="relative max-w-sm mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-12 pl-12 pr-4
                bg-slate-900/50 border border-slate-800/50 rounded-xl
                text-slate-200 placeholder:text-slate-500
                focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10
                transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
