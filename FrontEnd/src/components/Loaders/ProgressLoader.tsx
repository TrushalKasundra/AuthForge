
import React, { useEffect, useRef, useState } from "react";

interface ProgressLoaderProps {
  isLoading: boolean;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const startRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  console.log("first",visible, isLoading,progress)

  useEffect(() => {
    if (isLoading) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setVisible(true);
      setProgress(0);
      startRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startRef.current;

        setProgress(() => {
          if (elapsed < 300) {
            return (elapsed / 300) * 30;
          }

          if (elapsed < 1000) {
            return 30 + ((elapsed - 300) / 700) * 30;
          }

          if (elapsed < 3000) {
            return 60 + ((elapsed - 1000) / 2000) * 25;
          }

          return Math.min(85 + (elapsed - 3000) / 500, 95);
        });
      }, 50);
    } else if (visible) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setProgress(100);

      const timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(timeout);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="fixed left-0 top-0 z-[9999] h-[0.2rem] w-full overflow-hidden bg-transparent"
    >
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(139,92,246,0.7)] transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressLoader;
