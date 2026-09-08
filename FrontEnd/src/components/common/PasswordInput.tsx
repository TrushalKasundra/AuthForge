import { useState } from 'react';
import { Field } from 'formik';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  hasError?: boolean;
  className?: string;
}

const PasswordInput = ({
  id,
  name,
  placeholder = 'Enter password',
  autoComplete = 'current-password',
  hasError = false,
  className = '',
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseClass = `
    w-full h-10 [@media(min-height:700px)]:h-12 px-4 pr-12 rounded-xl bg-slate-900/60 border text-slate-100 text-sm
    placeholder:text-slate-500 transition-all duration-200
    focus:outline-none focus:border-indigo-500
  `;

  const errorClass = hasError
    ? 'border-red-500/50 focus:border-red-500'
    : 'border-slate-700/50';

  return (
    <div className="relative">
      <Field
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${baseClass} ${errorClass} ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5
          text-slate-500 hover:text-slate-300
          transition-colors duration-200
          focus:outline-none focus:text-indigo-400"
        tabIndex={-1}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
