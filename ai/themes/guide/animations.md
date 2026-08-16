# Animation & Motion Guide

The NeonRed feel is: **smooth, springy, glowy, but never janky**. Every motion below is
defined once in `theme/tailwind.config.js` (keyframes + animation names) and mirrored in
`theme/globals.css`. Use these names directly in `className`.

## Core animations

| Class                | Effect                                              | Duration / Easing                          |
|----------------------|-----------------------------------------------------|--------------------------------------------|
| `animate-fade-in`    | opacity 0 → 1 (backdrops, overlays)                 | 300ms ease-out                             |
| `animate-slide-up`   | translateY(20px)+fade → 0 (modals, cards)           | 0.5s ease-out                              |
| `animate-slide-in-right` | translateX(24px)+fade → 0 (toasts)              | 0.45s cubic-bezier(0.22,1,0.36,1)          |
| `animate-pulse-slow` | breathing glow on icons/blobs                       | 3s cubic-bezier(0.4,0,0.6,1) infinite      |
| `animate-shimmer`    | light sweep across progress bars / toasts           | 2s linear infinite                         |
| `animate-wave`       | liquid loader rotation                              | 5s linear infinite                         |
| `animate-wave-fast`  | equalizer bars / playing indicator                  | 1s ease-in-out infinite (stagger 0.1–0.2s) |
| `animate-gradient-x` | moving gradient (accent bars, backgrounds)          | 15s ease infinite                          |
| `animate-border-flow`| rotating border gradient                            | 4s linear infinite                         |
| `animate-scanline`   | scanning line top→bottom                            | 4s linear infinite                         |
| `animate-spin`       | loading spinners                                    | 1s linear infinite                         |
| `animate-ping`       | radar ping around "update available" dot           | 1s cubic-bezier infinite                  |
| `animate-bounce`     | confirm/trash icon micro-bounce on hover            | built-in                                    |

## Motion principles (must keep for brand consistency)

1. **Hover micro-interactions**: buttons lift with `hover:scale-[1.02]`, press with
   `active:scale-95`. Window controls spin/rotate (`hover:rotate-90`, `-rotate-12`).
2. **Springy, not linear**: prefer `cubic-bezier(0.22,1,0.36,1)` for entrances.
3. **Glow on focus/hover**: red neon `shadow-[0_0_20px_rgba(239,68,68,0.6)]` on the
   active nav item, close button, selected card.
4. **Ambient blobs**: every modal has a blurred coloured circle
   (`bg-red-600/10 blur-[80px]`) behind it for depth.
5. **Top accent bar**: modals carry a 4px gradient bar
   (`from-red-600 via-orange-600 to-red-600`) — swap colour per message type.
6. **Page transitions**: stacked pages cross-fade + `translate-y-10 scale-95 → 0/100`
   over 0.5s (see `App.tsx` pattern).

## Low-power mode (performance link)
When `SmartCoreContext` detects FPS < 35 it adds `html.low-power` which (via globals.css)
collapses **all** animations/transitions/backdrop-blur to ~0. Never hard-code infinite
animations that ignore this class.

## Equalizer / "now playing" indicator
```tsx
<div className="w-1 bg-red-500 rounded-full animate-wave-fast" />
<div className="w-1 bg-red-500 rounded-full animate-wave-fast" style={{ animationDelay: '0.1s' }} />
<div className="w-1 bg-red-500 rounded-full animate-wave-fast" style={{ animationDelay: '0.2s' }} />
```
