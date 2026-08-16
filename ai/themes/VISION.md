# NeonRed UI — Design Vision (بینش طراحی)

NeonRed is a **dark, glassmorphic, neon-red command center**. Its visual identity is not
decoration — it is a system. The goal of this kit is to let an AI (or a human) build
**any** desktop/web application — a calculator, a file manager, a music tool, a settings
panel, a game launcher — and have it look, move and perform **exactly** like NeonRed
Soundpad, with zero extra design decisions.

## Design DNA

1. **Pure-black canvas, floating glass.**
   Background is `#000`/`#050505`. Surfaces are semi-transparent black with
   `backdrop-blur` (md/xl/2xl). Nothing is flat — everything floats on a dark void.

2. **Red is the brand, colour is reserved for meaning.**
   Primary neon red `#ef4444` / `#ff0000` is used for branding, active states and danger.
   Green = success, amber = warning, blue = info, red = error. Colour never decorates;
   it communicates (see `guide/colors.md`).

3. **Glow = depth.**
   Every interactive or active element carries a soft red neon glow
   (`0 0 20px rgba(239,68,68,0.6)`). Modals get an ambient blurred colour blob behind
   them. Glow replaces borders for hierarchy.

4. **Springy, breathing motion.**
   Entrances slide + fade with a springy cubic-bezier. Icons pulse slowly. Progress bars
   shimmer. Nothing is linear, nothing is static, but nothing janks (GPU-only transforms).
   See `guide/animations.md`.

5. **Performance is part of the aesthetic.**
   A NeonRed app is calm: 0% GPU when hidden, auto low-power mode under load. Smoothness
   is a feature. See `guide/performance.md`.

6. **Bilingual by default.**
   English + Persian with full RTL. `font-persian` (Vazirmatn) for Farsi, `font-sans`
   (Inter) for Latin. See `guide/rtl-i18n.md`.

## What "built with NeonRed" must mean
- Same tokens (`theme/tokens.json`) → identical colours, radii, shadows, fonts.
- Same components (`components/*`) → identical modals, buttons, toasts, title bar, loader.
- Same motion (`theme/tailwind.config.js`) → same animations by name.
- Same perf governor (`SmartCoreContext`) → same background-suspend + low-power behaviour.
- Same message colours (`Toast` + `guide/colors.md`) → identical feedback language.

If those five hold, a calculator and a soundboard are visually the same product family.
