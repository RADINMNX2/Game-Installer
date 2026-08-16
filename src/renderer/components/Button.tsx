import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'white';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 select-none active:scale-95 focus:outline-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 hover:shadow-red-900/50 hover:scale-[1.02]',
  secondary:
    'bg-zinc-900 hover:bg-zinc-800 text-gray-300 border border-white/5',
  ghost:
    'bg-transparent hover:bg-white/10 text-gray-300 border border-white/5',
  danger:
    'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40',
  success:
    'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/40',
  white:
    'bg-white hover:bg-gray-200 text-black shadow-lg',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
  icon: 'w-10 h-10',
};

/**
 * NeonRed button — the single source of truth for every clickable action.
 * Hover lift + scale, neon shadow, active press. Pair with lucide-react icons.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', icon, fullWidth, className = '', children, ...rest
}) => (
  <button
    className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...rest}
  >
    {icon}
    {children}
  </button>
);

export default Button;
