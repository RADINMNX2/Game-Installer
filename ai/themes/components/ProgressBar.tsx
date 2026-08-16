import React from 'react';

interface ProgressBarProps {
  percent: number;          // 0 - 100
  color?: 'primary' | 'success' | 'info';
  showShimmer?: boolean;
  height?: string;
}

const colorMap = {
  primary: 'from-red-600 to-orange-500',
  success: 'from-green-500 to-emerald-400',
  info:    'from-blue-500 to-sky-400',
};

/**
 * Neon progress bar with animated shimmer overlay (download / load states).
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  percent, color = 'primary', showShimmer = true, height = 'h-3',
}) => (
  <div className={`w-full ${height} bg-zinc-800 rounded-full overflow-hidden border border-white/5`}>
    <div
      className={`h-full bg-gradient-to-r ${colorMap[color]} transition-all duration-300 relative`}
      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
    >
      {showShimmer && (
        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
      )}
    </div>
  </div>
);

export default ProgressBar;
