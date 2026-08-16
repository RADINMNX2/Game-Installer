/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/**/*.{js,jsx,ts,tsx}',
    './src/renderer/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Vazirmatn', 'ui-sans-serif', 'system-ui'],
        persian: ['Vazirmatn', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        background: '#050505',
        surface: '#121212',
        'surface-raised': '#1a1a1a',
        primary: '#ef4444',
        'primary-hover': '#f87171',
        secondary: '#be123c',
        accent: '#ff0000',
        'text-main': '#ffffff',
        'text-muted': '#9ca3af',
        'text-dim': '#6b7280',
        border: 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.20)',
        'primary-border': 'rgba(239,68,68,0.30)',
        'primary-border-strong': 'rgba(239,68,68,0.60)',
        success: '#22c55e',
        warning: '#f59e0b',
        info: '#3b82f6',
        danger: '#ef4444',
      },
      borderRadius: {
        sm: '0.5rem', md: '0.75rem', lg: '1rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.75rem',
      },
      boxShadow: {
        'card': '0 10px 40px -10px rgba(0,0,0,0.8)',
        'card-neon': '0 0 50px rgba(239,68,68,0.18)',
        'modal': '0 25px 60px -15px rgba(0,0,0,0.9)',
        'modal-green': '0 0 50px rgba(34,197,94,0.2)',
        'glow-primary': '0 0 20px rgba(239,68,68,0.6)',
        'glow-primary-strong': '0 0 30px rgba(239,68,68,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'border-flow': 'borderRotate 4s linear infinite',
        'scanline': 'scanline 4s linear infinite',
        'wave': 'wave 5s linear infinite',
        'wave-fast': 'wave 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        borderRotate: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        scanline: {
          '0%': { top: '-20%' },
          '100%': { top: '120%' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: []
}
