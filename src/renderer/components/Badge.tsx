import React from 'react';

type Tone = 'primary' | 'success' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const tones: Record<Tone, string> = {
  primary: 'bg-red-500/10 text-red-400 border-red-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  neutral: 'bg-white/5 text-gray-400 border-white/5',
};

/** Small status pill used for tags, counts, "Active", shortcuts, version chips. */
const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral', className = '' }) => (
  <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold font-mono ${tones[tone]} ${className}`}>
    {children}
  </span>
);

export default Badge;
