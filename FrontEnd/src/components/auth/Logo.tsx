import { Shield, Hammer } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const Logo = ({ size = 'md', showTagline = true, className = '' }: LogoProps) => {
  const sizes = {
    sm: {
      container: 'gap-2',
      iconWrapper: 'w-9 h-9',
      icon: 16,
      title: 'text-lg',
      tagline: 'text-xs',
      iconMargin: 'mb-3',
    },
    md: {
      container: 'gap-2.5',
      iconWrapper: 'w-10 h-10',
      icon: 18,
      title: 'text-xl',
      tagline: 'text-sm',
      iconMargin: 'mb-4',
    },
    lg: {
      container: 'gap-3',
      iconWrapper: 'w-12 h-12',
      icon: 22,
      title: 'text-2xl',
      tagline: 'text-sm',
      iconMargin: 'mb-5',
    },
  };

  const config = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Icon Group */}
      <div className={`flex items-center ${config.container} ${config.iconMargin}`}>
        <div 
          className={`
            relative ${config.iconWrapper} 
            rounded-xl
            bg-gradient-to-br from-indigo-500 to-violet-600
            flex items-center justify-center
            shadow-lg shadow-indigo-500/30
            animate-float
          `}
        >
          <Shield size={config.icon} className="text-white" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-xl opacity-40 -z-10" />
        </div>
        
        <div 
          className={`
            relative ${config.iconWrapper} 
            rounded-xl
            bg-gradient-to-br from-violet-500 to-purple-600
            flex items-center justify-center
            shadow-lg shadow-violet-500/30
            animate-float
          `}
          style={{ animationDelay: '150ms' }}
        >
          <Hammer size={config.icon} className="text-white" strokeWidth={2} />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 blur-xl opacity-40 -z-10" />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className={`${config.title} font-bold text-white tracking-tight`}>
        Auth<span className="text-indigo-400">Forge</span>
      </h1>
      
      {/* Tagline */}
      {showTagline && (
        <p className={`${config.tagline} text-slate-400 mt-1.5`}>
          Secure Authentication System
        </p>
      )}
    </div>
  );
};

export default Logo;
