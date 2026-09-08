
import { ShieldCheck, TriangleAlert } from "lucide-react";
import type { FC } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router";

const ErrorBoundary: FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  let status = "500";
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    status = String(error.status);

    if (error.status === 404) {
      title = "Page not found";
      message =
        "The page you're looking for doesn't exist or may have been moved.";
    } else {
      title = error.statusText || "Something went wrong";
      message = error.data?.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 shadow-[0_0_40px_rgba(124,58,237,0.25)]">
            <TriangleAlert
              className="h-9 w-9 text-purple-400"
              strokeWidth={1.7}
            />
          </div>

          {/* Status */}
          <div className="mb-3 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-8xl font-bold tracking-tight text-transparent">
            {status}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>

          {/* Message */}
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
            {message}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              className="rounded-lg border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              Go Back
            </button>

            <button
              type="button"
              onClick={handleGoHome}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-900/30 transition hover:from-violet-500 hover:to-indigo-500"
            >
              Go Home
            </button>

            <button
              type="button"
              onClick={handleRetry}
              className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-5 py-2.5 text-sm font-medium text-purple-300 transition hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-purple-200"
            >
              Try Again
            </button>
          </div>

          {/* Brand */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-purple-900/30">
              <ShieldCheck
                className="h-4 w-4 text-white"
                strokeWidth={2}
              />
            </div>

            <span className="text-sm font-semibold text-slate-300">
              AuthForge
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-600">
            Secure Authentication System
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
