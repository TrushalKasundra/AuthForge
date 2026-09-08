import Logo from '@/components/auth/Logo';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import SVGIcons from '@/utils/SVGIcons';
import { loginSchema } from '@/validations/authSchemas';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import { toFormikValidationSchema } from 'zod-formik-adapter';

// Security features displayed on the login page
const SECURITY_FEATURES = [
  'End-to-end encryption',
  'Multi-factor authentication',
  'Real-time session management',
] as const;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(null);

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setSocialLoading(provider);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.error(`${provider === 'github' ? 'GitHub' : 'Google'} login coming soon!`);
    } catch {
      toast.error(`${provider === 'github' ? 'GitHub' : 'Google'} login failed`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen max-h-screen bg-[#020617] flex">
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12 xl:px-20">
          <div className="max-w-lg ml-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-indigo-300 font-medium">Enterprise-grade Security</span>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Secure your apps with{' '}
              <span className="gradient-text-primary">modern authentication</span>
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-10">
              JWT-based authentication with refresh tokens, role-based access control, 
              and enterprise security features.
            </p>

            <div className="space-y-4">
              {SECURITY_FEATURES.map((feature, i) => (
                <div 
                  key={feature} 
                  className="flex items-center gap-3 animate-fade-in-left"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <SVGIcons icon="correct" size={18} />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col px-6 sm:px-10 lg:px-12 py-8 overflow-y-auto">
        <div className="w-full max-w-[400px] mx-auto my-auto">
          
          <div className="mb-6">
            <Logo size="md" />
          </div>

          <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={toFormikValidationSchema(loginSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await login({ email: values.email, password: values.password });
                toast.success('Welcome back!');
                navigate('/dashboard');
              } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Login failed');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className={`
                      w-full h-12 px-4 rounded-xl bg-slate-900/60 border text-slate-100 text-sm
                      placeholder:text-slate-500 transition-all duration-200
                      focus:outline-none focus:border-indigo-500
                      ${errors.email && touched.email 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-slate-700/50'}
                    `}
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-xs text-red-400" />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-1">
                    Password
                  </label>
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    hasError={!!(errors.password && touched.password)}
                  />
                  <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-400" />
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800/50 
                        text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-0"
                    />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    className="text-sm text-indigo-400 font-medium hover:text-indigo-300 
                      transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-slate-500 bg-[#020617]">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2.5 h-11
                bg-slate-800/50 border border-slate-700/50 rounded-xl
                text-slate-300 font-medium text-sm
                hover:bg-slate-800 hover:border-slate-600
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              {socialLoading === 'github' ? (
                <div className="w-[18px] h-[18px] border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <SVGIcons icon="github" size={18} />
              )}
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2.5 h-11
                bg-slate-800/50 border border-slate-700/50 rounded-xl
                text-slate-300 font-medium text-sm
                hover:bg-slate-800 hover:border-slate-600
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              {socialLoading === 'google' ? (
                <div className="w-[18px] h-[18px] border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <SVGIcons icon="google" size={18} />
              )}
              <span>Google</span>
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
