import { useState, type InputHTMLAttributes, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2, type LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  disabled,
  rightElement,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-') || undefined;

  const hasError = !!error;
  const hasSuccess = !!success;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block text-sm font-medium mb-1
            transition-colors duration-200
            ${hasError ? 'text-red-400' : hasSuccess ? 'text-emerald-400' : isFocused ? 'text-slate-200' : 'text-slate-400'}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div
        className={`
          relative flex items-center
          bg-slate-900/60 
          rounded-xl
          border transition-all duration-200
          ${hasError 
            ? 'border-red-500/50 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20' 
            : hasSuccess 
              ? 'border-emerald-500/50 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
              : 'border-slate-700/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Left Icon */}
        {Icon && (
          <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
            <Icon
              size={18}
              strokeWidth={1.5}
              className={`
                transition-colors duration-200
                ${hasError ? 'text-red-400' : hasSuccess ? 'text-emerald-400' : isFocused ? 'text-indigo-400' : 'text-slate-500'}
              `}
            />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            input-field flex-1 h-12
            ${Icon ? 'pl-0' : 'pl-4'}
            ${isPassword || rightElement ? 'pr-12' : 'pr-4'}
            bg-transparent border-none
            text-slate-100 text-sm
            placeholder:text-slate-500
            disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className={`
              flex items-center justify-center w-12 h-12 flex-shrink-0
              bg-transparent border-none cursor-pointer
              transition-colors duration-200
              ${isFocused ? 'text-indigo-400' : 'text-slate-500'}
              hover:text-slate-300
              disabled:cursor-not-allowed
            `}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Right Element */}
        {!isPassword && rightElement && (
          <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
            {rightElement}
          </div>
        )}

        {/* Success Icon */}
        {hasSuccess && !isPassword && !rightElement && (
          <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
        )}
      </div>

      {/* Helper Text */}
      {(error || success || hint) && (
        <div
          className={`
            flex items-start gap-1.5 mt-1
            ${hasError ? 'text-red-400' : hasSuccess ? 'text-emerald-400' : 'text-slate-500'}
          `}
        >
          {hasError && <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
          {hasSuccess && <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />}
          <p className="text-xs leading-relaxed">{error || success || hint}</p>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
