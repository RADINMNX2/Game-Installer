import React, { ReactNode } from 'react';

type Tab = { id: string; label: string; icon: ReactNode };

interface TitleBarProps {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  left?: ReactNode;          // status pill / update badge
  right?: ReactNode;         // window controls / actions
  draggable?: boolean;       // Electron: enable -webkit-app-region drag
}

/**
 * App top bar — sticky, blurred, draggable region (Electron), centered tab nav,
 * hover-glow window controls. The shell for any NeonRed desktop app.
 */
const TitleBar: React.FC<TitleBarProps> = ({
  tabs = [], activeTab, onTabChange, left, right, draggable = false,
}) => (
  <div
    className="h-16 bg-black/90 backdrop-blur-xl border-b border-white/5 flex justify-between items-center select-none sticky top-0 z-[100] w-full px-6 shadow-2xl shadow-black/50"
    style={draggable ? ({ WebkitAppRegion: 'drag' } as React.CSSProperties) : undefined}
  >
    <div className="w-1/3 h-full flex items-center gap-3">{left}</div>

    <div
      className="flex items-center justify-center gap-3 bg-zinc-950/80 p-2 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl"
      style={draggable ? ({ WebkitAppRegion: 'no-drag' } as React.CSSProperties) : undefined}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange?.(tab.id)}
          className={`relative px-6 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 overflow-hidden group
            ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          {activeTab === tab.id && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-xl shadow-inner animate-fade-in" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <span className={`transition-all duration-300 ${activeTab === tab.id ? 'text-red-500 scale-110' : 'group-hover:text-red-400'}`}>
              {tab.icon}
            </span>
            <span className="text-sm font-bold tracking-wide">{tab.label}</span>
          </span>
        </button>
      ))}
    </div>

    <div className="flex h-full items-center justify-end w-1/3" style={draggable ? ({ WebkitAppRegion: 'no-drag' } as React.CSSProperties) : undefined}>
      {right}
    </div>
  </div>
);

export default TitleBar;
