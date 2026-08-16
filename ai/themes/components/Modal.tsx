import React, { ReactNode } from 'react';

export type ModalAccent = 'primary' | 'success' | 'info' | 'warning';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  accent?: ModalAccent;     // colour of the top bar + ambient glow
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  zIndex?: number;
}

const accentMap: Record<ModalAccent, { bar: string; glow: string }> = {
  primary: { bar: 'from-red-600 via-orange-600 to-red-600', glow: 'bg-red-600/10' },
  success: { bar: 'from-green-400 via-emerald-500 to-green-400', glow: 'bg-green-500/10' },
  info:    { bar: 'from-blue-500 via-sky-500 to-blue-500', glow: 'bg-blue-500/10' },
  warning: { bar: 'from-amber-400 via-orange-500 to-amber-400', glow: 'bg-amber-500/10' },
};

const sizeMap = {
  sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl', full: 'max-w-[95vw]',
};

/**
 * Base modal — the canonical NeonRed overlay:
 * blurred black backdrop, floating glass card, animated top accent bar,
 * ambient coloured glow blob, slide-up entrance. Build every dialog on top of this.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, children, accent = 'primary', size = 'md', closeOnBackdrop = true, zIndex = 100,
}) => {
  if (!isOpen) return null;
  const a = accentMap[accent];

  return (
    <div className={`fixed inset-0 z-[${zIndex}] flex items-center justify-center p-4`}>
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div className={`relative w-full ${sizeMap[size]} bg-zinc-950 border border-red-500/20 rounded-3xl shadow-2xl shadow-red-900/40 animate-slide-up overflow-hidden group`}>
        <div className={`absolute -top-20 -left-20 w-60 h-60 ${a.glow} rounded-full blur-[80px] pointer-events-none`} />
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${a.bar}`} />
        {children}
      </div>
    </div>
  );
};

export default Modal;
