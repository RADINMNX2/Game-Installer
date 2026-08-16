# Performance Guide — "SmartCore"

NeonRed stays at ~0% GPU when minimised and never drops frames on weak hardware.
Reproduce these exact patterns in any app built from this kit.

## 1. Background suspension (visibility)
When the window/tab is hidden, **stop all render loops** (rAF, visualisers, timers that
paint). Restore on return. Implemented in `components/SmartCoreContext.tsx`:

```ts
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(rafId);     // 0% GPU in tray
  else startMonitor();
});
```

## 2. FPS governor → low-power mode
Measure FPS once per second; if `< 35` fps, enable `isLowPowerMode`. If it recovers
`> 50` fps, disable. The UI uses this to simplify effects, and `globals.css`
(`html.low-power`) neutralises heavy CSS automatically.

```ts
if (currentFps < 35 && !isLowPowerMode) setIsLowPowerMode(true);
else if (currentFps > 50 && isLowPowerMode) setIsLowPowerMode(false);
```

Thresholds (from `theme/tokens.json → performance`):
`lowPowerFpsThreshold: 35`, `recoverFpsThreshold: 50`.

## 3. Render-heavy cards
Memoise grid items (`React.memo`) and add containment so off-screen work is skipped:

```tsx
const Card = memo(HeavyCard, areEqual);
// inside: style={{ contentVisibility: 'auto', contain: 'layout paint style', willChange: 'transform, box-shadow' }}
```

## 4. Animation budget
* Keep infinite animations cheap (transform/opacity only — GPU-composited).
* Respect `html.low-power` (do not animate `filter`/`backdrop-filter` when set).
* Use `requestAnimationFrame` for any continuous visual; never `setInterval` for paint.

## 5. Boot cost
Lazy-mount the `LoadingScreen` (`components/LoadingScreen.tsx`) then fade the app in with
`transition-opacity duration-1000` so first paint is not blocked by heavy UI.

## Checklist for a new NeonRed app
- [ ] Wrap root in `<SmartCoreProvider>` + `<ThemeProvider>` + `<ToastProvider>`.
- [ ] Add `html.low-power` CSS rule (already in globals.css).
- [ ] Memo + `content-visibility:auto` on every repeating tile.
- [ ] Cancel rAF on `visibilitychange`.
- [ ] Only animate `transform`/`opacity`.
