import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import toast from 'react-hot-toast';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Logo from '@/components/auth/Logo';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import SVGIcons from '@/utils/SVGIcons';
import { registerSchema } from '@/validations/authSchemas';

// Password strength helpers
const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500'];

// Platform statistics displayed on the registration page
const PLATFORM_STATS = [
  { value: '50K+', label: 'Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 100ms', label: 'Latency' },
] as const;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(null);

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setSocialLoading(provider);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.error(`${provider === 'github' ? 'GitHub' : 'Google'} sign up coming soon!`);
    } catch {
      toast.error(`${provider === 'github' ? 'GitHub' : 'Google'} sign up failed`);
    } finally {
      setSocialLoading(null);
    }
  };

  // Input field class helper
  const getInputClass = (hasError: boolean) => `
    w-full h-10 [@media(min-height:700px)]:h-12 px-4 rounded-xl bg-slate-900/60 border text-slate-100 text-sm
    placeholder:text-slate-500 transition-all duration-200
    focus:outline-none focus:border-indigo-500
    ${hasError ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50'}
  `;

  return (
    <div className="min-h-screen max-h-screen bg-[#020617] flex">
      
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col px-6 sm:px-10 lg:px-12 py-8 overflow-y-auto">
        <div className="w-full max-w-[420px] mx-auto my-auto">
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2 [@media(min-height:700px)]:mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to login</span>
          </Link>

          <div className="mb-3 [@media(min-height:700px)]:mb-5 animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Create your account</h1>
            <p className="text-slate-400 text-sm sm:text-base">Start your 30-day free trial. No credit card required.</p>
          </div>

          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={toFormikValidationSchema(registerSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await register({
                  name: values.name,
                  email: values.email,
                  password: values.password,
                });
                toast.success('Account created successfully!');
                navigate('/');
              } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Registration failed');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="animate-fade-in-up animation-delay-100">
                <div className="space-y-3 [@media(min-height:700px)]:space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">
                      Full Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      className={getInputClass(!!errors.name && !!touched.name)}
                    />
                    <ErrorMessage name="name" component="p" className="mt-1 text-xs text-red-400" />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">
                      Work Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      className={getInputClass(!!errors.email && !!touched.email)}
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
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      hasError={!!(errors.password && touched.password)}
                    />
                    <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-400" />
                    
                    {/* Password Strength Indicator */}
                    {values.password && (
                      <div className="mt-2 space-y-1 animate-fade-in">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => {
                            const strength = getPasswordStrength(values.password);
                            return (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  i < strength ? strengthColors[strength - 1] : 'bg-slate-700/50'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <p className="text-xs text-slate-500">
                          Password strength:{' '}
                          <span className={
                            getPasswordStrength(values.password) >= 4 ? 'text-emerald-400' : 
                            getPasswordStrength(values.password) >= 2 ? 'text-yellow-400' : 'text-red-400'
                          }>
                            {getPasswordStrength(values.password) > 0 
                              ? strengthLabels[getPasswordStrength(values.password) - 1] 
                              : 'Too short'}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-400 mb-1">
                      Confirm Password
                    </label>
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      hasError={!!(errors.confirmPassword && touched.confirmPassword)}
                    />
                    <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-xs text-red-400" />
                    
                    {/* Match indicator */}
                    {values.confirmPassword && values.password === values.confirmPassword && (
                      <div className="flex items-center gap-1.5 mt-1 text-emerald-400 animate-fade-in">
                        <Check size={14} />
                        <span className="text-xs font-medium">Passwords match</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 [@media(min-height:700px)]:mt-5">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<ArrowRight size={18} />}
                  >
                    Create Account
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative my-3 [@media(min-height:700px)]:my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-slate-500 bg-[#020617]">or sign up with</span>
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

          <p className="text-center text-slate-400 text-sm mt-3 [@media(min-height:700px)]:mt-4">
            Already have an account?{' '}
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-violet-600/20 via-indigo-600/10 to-transparent" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/25 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12 xl:px-20">
          <div className="animate-fade-in-up">
            <Logo size="lg" showTagline={false} className="mb-12" />
            
            <div className="max-w-md p-6 xl:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <p className="text-base xl:text-lg text-slate-300 leading-relaxed mb-6">
                "AuthForge transformed how we handle authentication. Setup took minutes, 
                and the security features are enterprise-grade."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                  SK
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sarah Kim</p>
                  <p className="text-xs text-slate-400">CTO at TechStartup</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              {PLATFORM_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl xl:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs xl:text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
