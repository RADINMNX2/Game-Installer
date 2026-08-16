import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

/**
 * SmartCore — performance governor.
 *  • Suspends the requestAnimationFrame render loop when the window is hidden
 *    (tab/app backgrounded) so GPU/CPU drops to ~0%.
 *  • Measures FPS once per second; when FPS < 35 it flips the app into
 *    "low power mode" (isLowPowerMode = true) which the UI uses to simplify
 *    animations (or the globals.css `html.low-power` rule kills them entirely).
 * Drop this provider at the root of ANY app to inherit NeonRed's perf behaviour.
 */
interface SmartCoreState {
  isBackground: boolean;
  isLowPowerMode: boolean;
  fps: number;
  reportActivity: (tag: string) => void;
}

const SmartCoreContext = createContext<SmartCoreState | undefined>(undefined);

export const SmartCoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBackground, setIsBackground] = useState(document.hidden);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [fps, setFps] = useState(60);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onVisibility = () => {
      const hidden = document.hidden;
      setIsBackground(hidden);
      if (hidden && rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      } else {
        startMonitor();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const startMonitor = () => {
    if (rafId.current) return;
    const loop = () => {
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        const currentFps = frameCount.current;
        setFps(currentFps);
        if (currentFps < 35 && !isLowPowerMode) setIsLowPowerMode(true);
        else if (currentFps > 50 && isLowPowerMode) setIsLowPowerMode(false);
        frameCount.current = 0;
        lastTime.current = now;
      }
      if (!document.hidden) rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    startMonitor();
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  // Reflect low-power mode to CSS so globals.css can neutralise heavy effects
  useEffect(() => {
    document.documentElement.classList.toggle('low-power', isLowPowerMode);
  }, [isLowPowerMode]);

  const reportActivity = (_tag: string) => { /* hook for context-aware optimisations */ };

  return (
    <SmartCoreContext.Provider value={{ isBackground, isLowPowerMode, fps, reportActivity }}>
      {children}
    </SmartCoreContext.Provider>
  );
};

export const useSmartCore = () => {
  const ctx = useContext(SmartCoreContext);
  if (!ctx) throw new Error('useSmartCore must be used within a SmartCoreProvider');
  return ctx;
};
