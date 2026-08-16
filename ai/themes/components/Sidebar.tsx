import React, { ReactNode } from 'react';

interface NavItem {
  id: string;
  icon: ReactNode;
  label: string;
  gradient?: string;        // active background gradient
}

interface SidebarProps {
  items: NavItem[];
  active: string;
  onChange: (id: string) => void;
  status?: ReactNode;       // floating status pill
}

/**
 * Floating glass dock (left-center). Active item morphs into a neon gradient pill.
 */
const Sidebar: React.FC<SidebarProps> = ({ items, active, onChange, status }) => (
  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6">
    <div className="flex flex-col items-center gap-4 p-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/80 transition-all duration-300 hover:border-white/20 hover:bg-black/50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          title={item.label}
          className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 group cursor-pointer
            ${active === item.id ? 'text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
        >
          <div className={`absolute inset-0 ${item.gradient || 'from-red-600 to-pink-600'} rounded-2xl transition-all duration-500 ${active === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
          <div className="relative z-10">
            <span className={`transition-all duration-300 ${active === item.id ? 'rotate-0' : 'group-hover:rotate-90'}`}>
              {item.icon}
            </span>
          </div>
        </button>
      ))}
    </div>
    {status}
  </div>
);

export default Sidebar;
