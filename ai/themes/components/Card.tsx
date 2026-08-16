import React, { ReactNode, memo } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;          // red neon border glow on hover
  interactive?: boolean;   // hover lift + border highlight
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Glass surface card. The building block for tiles, lists, panels.
 * `interactive` gives the hover border-glow seen on SoundButton / device rows.
 */
const Card: React.FC<CardProps> = ({
  children, className = '', glow = true, interactive = false, selected = false, onClick,
}) => (
  <div
    onClick={onClick}
    className={[
      'relative rounded-3xl border overflow-hidden transition-all duration-200',
      glow ? 'bg-zinc-900/40 border-white/5' : 'bg-surface border-border',
      selected
        ? 'bg-red-900/40 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
        : interactive
          ? 'hover:border-red-500/50 hover:bg-zinc-800/60 cursor-pointer'
          : '',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

export default memo(Card);
