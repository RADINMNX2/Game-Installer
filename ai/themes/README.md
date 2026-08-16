# NeonRed UI Kit — `ai/`

A complete, **AI-ready design system** extracted from NeonRed Soundpad. Use it to build
**any** application (calculator, desktop app, dashboard, settings tool…) with the exact
same theme, modals, message colours, animations and performance as NeonRed — without
re-deciding the design.

## What's inside

```
ai/
├── README.md                 # this file
├── VISION.md                 # design philosophy / brand DNA
├── AI-PROMPT.md              # copy-paste system prompt for code AIs
├── theme/
│   ├── tokens.json           # single source of truth (colours, radii, shadows,
│   │                         #   glows, fonts, animations, MESSAGE colour scheme)
│   ├── tailwind.config.js    # ready tailwind theme.extend (colors+keyframes+animate-*)
│   └── globals.css           # CSS vars, .glass utils, scrollbar, keyframes, low-power
├── components/
│   ├── ThemeContext.tsx      # runtime theme (CSS vars from tokens)
│   ├── SmartCoreContext.tsx  # perf governor: bg-suspend + low-power FPS mode
│   ├── Modal.tsx             # base glass modal (accent bar + ambient glow)
│   ├── ConfirmModal.tsx      # destructive confirm dialog
│   ├── Button.tsx            # neon button variants
│   ├── Card.tsx              # glass tile/list/panel
│   ├── Toast.tsx             # message system (error/success/warning/info/accent)
│   ├── Input.tsx             # glass text field
│   ├── ProgressBar.tsx       # shimmer progress
│   ├── TitleBar.tsx          # app shell top bar (draggable, tabs)
│   ├── Sidebar.tsx           # floating glass nav dock
│   ├── LoadingScreen.tsx     # liquid boot loader
│   └── Badge.tsx             # status pill
└── guide/
    ├── colors.md             # MESSAGE colour scheme + usage rules
    ├── animations.md         # animation names, motion principles
    ├── performance.md        # SmartCore perf patterns + checklist
    └── rtl-i18n.md           # en/fa + RTL localization pattern
```

## How to use

1. **Drop the theme in**: copy `theme/tailwind.config.js` `theme.extend` into your
   `tailwind.config.js`, import `theme/globals.css` in your entry CSS.
2. **Install deps**: `react`, `react-dom`, `tailwindcss`, `lucide-react` (icons).
3. **Wrap the app**:
   ```tsx
   import { SmartCoreProvider } from './ai/components/SmartCoreContext';
   import { ThemeProvider } from './ai/components/ThemeContext';
   import { ToastProvider } from './ai/components/Toast';
   <SmartCoreProvider><ThemeProvider><ToastProvider>{app}</ToastProvider></ThemeProvider></SmartCoreProvider>
   ```
4. **Build with the kit**: `Modal`, `Button`, `Card`, `Toast`, `TitleBar`, `Sidebar`,
   `LoadingScreen` are ready. For AI generation, give it `AI-PROMPT.md` + this folder.

## Source
Extracted by reading the live NeonRed Soundpad source: `src/index.css`,
`tailwind.config.js`, `src/context/*`, `src/components/*` (ConfirmationModal,
DeviceSelectorModal, UpdateModal, TitleBar, Sidebar, SoundButton, LoadingScreen…).

## License
MIT — same as the source project.
