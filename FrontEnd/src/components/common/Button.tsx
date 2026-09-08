import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = ({
  children,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-semibold
    rounded-xl
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-indigo-600 to-indigo-500
      text-white
      shadow-lg shadow-indigo-500/25
      hover:from-indigo-500 hover:to-indigo-400
      hover:shadow-xl hover:shadow-indigo-500/30
      hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md
      focus-visible:ring-indigo-500
    `,
    secondary: `
      bg-slate-800
      text-slate-100
      border border-slate-700
      hover:bg-slate-700 hover:border-slate-600
      hover:-translate-y-0.5
      active:translate-y-0
      focus-visible:ring-slate-500
    `,
    ghost: `
      bg-transparent
      text-slate-400
      hover:text-slate-100 hover:bg-slate-800/50
      active:bg-slate-800
      focus-visible:ring-slate-500
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-500
      text-white
      shadow-lg shadow-red-500/25
      hover:from-red-500 hover:to-red-400
      hover:shadow-xl hover:shadow-red-500/30
      hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md
      focus-visible:ring-red-500
    `,
    success: `
      bg-gradient-to-r from-emerald-600 to-emerald-500
      text-white
      shadow-lg shadow-emerald-500/25
      hover:from-emerald-500 hover:to-emerald-400
      hover:shadow-xl hover:shadow-emerald-500/30
      hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md
      focus-visible:ring-emerald-500
    `,
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-6 text-sm',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={size === 'sm' ? 16 : 18} className="animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
