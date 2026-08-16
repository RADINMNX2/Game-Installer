# Message & Notification Color Scheme (رنگ‌بندی پیام‌ها)

This is the canonical colour system for every message, toast, alert, status and
notification in the NeonRed UI. Use it for **any** app so feedback looks identical
to NeonRed Soundpad.

## Palette

| Role     | Foreground | Background                | Border                   | Glow                                | Icon            |
|----------|-----------|---------------------------|--------------------------|-------------------------------------|-----------------|
| Error    | `#fca5a5` | `rgba(239,68,68,0.12)`    | `rgba(239,68,68,0.40)`   | `0 0 30px rgba(239,68,68,0.35)`     | `XCircle`       |
| Success  | `#86efac` | `rgba(34,197,94,0.12)`    | `rgba(34,197,94,0.40)`   | `0 0 30px rgba(34,197,94,0.30)`     | `CheckCircle`   |
| Warning  | `#fcd34d` | `rgba(245,158,11,0.12)`   | `rgba(245,158,11,0.40)`  | `0 0 30px rgba(245,158,11,0.30)`    | `AlertTriangle` |
| Info     | `#93c5fd` | `rgba(59,130,246,0.12)`   | `rgba(59,130,246,0.40)`  | `0 0 30px rgba(59,130,246,0.30)`    | `Info`          |
| Accent   | `#fca5a5` | `rgba(239,68,68,0.12)`    | `rgba(239,68,68,0.40)`   | `0 0 30px rgba(239,68,68,0.35)`     | `Zap`           |

> Icons come from `lucide-react`. Red (`error`/`accent`) is the brand danger colour.

## Usage rules (NeonRed voice)

1. **Never use flat solid fills** for messages — always `12%` alpha background + `40%`
   alpha border + coloured glow. Glassy, not solid.
2. **Rounded**: `rounded-2xl` (1rem) for toasts, `rounded-3xl` for modal alerts.
3. **Entrance**: toasts slide in from the right (`animate-slide-in-right`); modal alerts
   `animate-slide-up`.
4. **A 0.5-opacity shimmer line** sweeps the bottom of toasts (auto-dismiss timer).
5. **Destructive actions** (delete/reset) use the red `ConfirmModal` with a pulsing
   warning icon and a `Trash2` confirm button that bounces on hover.
6. **Position**: toasts stack top-right `z-[9999]`, width `20rem` (`w-80`).
7. **Text**: messages are `font-persian` so Farsi renders correctly; keep them short.

## Ready component
Use `components/Toast.tsx` → wrap app in `<ToastProvider>` and call:

```tsx
const toast = useToast();
toast.success('Saved', 'Your changes were stored.');
toast.error('Failed', 'Could not reach the server.');
toast.warning('Heads up', 'This will overwrite the file.');
toast.info('Update', 'A new version is available.');
```

## Status pills
Small state chips use `components/Badge.tsx`:
`primary` (red), `success` (green), `warning` (amber), `info` (blue), `neutral` (zinc).
Example: `ACTIVE`, `v1.3.4`, keyboard shortcuts (`Ctrl+K`), device counts.
