import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, Zap, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'warning' | 'info' | 'accent';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  show: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error:   (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info:    (title: string, message?: string) => void;
}

/* ---- NeonRed MESSAGE COLOR SCHEME (exact values from design tokens) ---- */
const scheme: Record<ToastType, {
  fg: string; bg: string; border: string; glow: string; Icon: React.FC<any>;
}> = {
  error:   { fg: '#fca5a5', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.40)',  glow: '0 0 30px rgba(239,68,68,0.35)',  Icon: XCircle },
  success: { fg: '#86efac', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.40)',  glow: '0 0 30px rgba(34,197,94,0.30)',  Icon: CheckCircle },
  warning: { fg: '#fcd34d', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.40)', glow: '0 0 30px rgba(245,158,11,0.30)', Icon: AlertTriangle },
  info:    { fg: '#93c5fd', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.40)', glow: '0 0 30px rgba(59,130,246,0.30)', Icon: Info },
  accent:  { fg: '#fca5a5', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.40)',  glow: '0 0 30px rgba(239,68,68,0.35)',  Icon: Zap },
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const show = (type: ToastType, title: string, message?: string, duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, title, message, duration }]);
    setTimeout(() => remove(id), duration);
  };

  const api: ToastContextValue = {
    show,
    success: (t, m) => show('success', t, m),
    error:   (t, m) => show('error', t, m),
    warning: (t, m) => show('warning', t, m),
    info:    (t, m) => show('info', t, m),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-80 max-w-[90vw] pointer-events-none">
        {toasts.map((t) => {
          const s = scheme[t.type];
          const Icon = s.Icon;
          return (
            <div
              key={t.id}
              className="pointer-events-auto relative flex items-start gap-3 p-4 rounded-2xl border animate-slide-in-right overflow-hidden"
              style={{ background: s.bg, borderColor: s.border, boxShadow: s.glow, color: s.fg }}
            >
              <Icon size={20} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm font-persian leading-tight">{t.title}</p>
                {t.message && <p className="text-xs opacity-80 mt-1 leading-snug">{t.message}</p>}
              </div>
              <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
              {/* progress shimmer line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-full animate-shimmer"
                   style={{ background: s.fg, opacity: 0.5 }} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
