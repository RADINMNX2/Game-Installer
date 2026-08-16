import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  brand?: string;
  brandColor?: string;      // liquid colour (original uses cyan; primary brand red)
  subtitle?: string;
}

/**
 * Liquid-fill loader with wave surface + percentage. The NeonRed boot screen.
 * Switch brandColor to match your app accent (e.g. '#06b6d4' or '#ef4444').
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete, brand = 'LOADING', brandColor = '#06b6d4', subtitle = 'Initializing Engine',
}) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setFading(true); setTimeout(onComplete, 800); }, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-all duration-1000 ${fading ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black opacity-80" />

      <div className="relative z-10 flex flex-col items-center gap-12">
        <div className="relative w-48 h-48 rounded-full border-4 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.4)] bg-black overflow-hidden group">
          <div
            className="absolute left-0 w-full shadow-[0_0_50px_#06b6d4] transition-all duration-100 ease-linear"
            style={{ bottom: 0, height: `${progress}%`, background: brandColor }}
          >
            <div className="absolute -top-3 left-[-50%] w-[200%] h-6 rounded-[40%] animate-wave opacity-80" style={{ background: brandColor }} />
            <div className="absolute -top-3 left-[-50%] w-[200%] h-6 rounded-[35%] animate-wave opacity-60" style={{ background: brandColor, animationDuration: '7s' }} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 mix-blend-difference">
            <span className="text-5xl font-black text-white font-mono tracking-tighter">{progress}%</span>
          </div>
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-white/10 rounded-full blur-sm" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-[0.2em]">
            {brand}<span className="animate-pulse" style={{ color: brandColor }}>...</span>
          </h1>
          <p className="text-[10px] font-mono text-cyan-500/70 tracking-[0.5em] uppercase">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
