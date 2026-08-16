# Localization & RTL Guide (i18n)

NeonRed ships English + Persian (Farsi) with full right-to-left support. Any app built
from this kit should inherit the same pattern so UIs are identical in both directions.

## Provider pattern
`context/LanguageContext.tsx` (original) exposes `t(key)`, `setLanguage`, `isRTL`.
Replicate it: store language in `localStorage`, set `document.documentElement.dir`
and `lang` on change.

```tsx
document.documentElement.dir  = language === 'fa' ? 'rtl' : 'ltr';
document.documentElement.lang = language;
```

## Typography
* Latin / numbers: `font-sans` → **Inter**.
* Persian text: add `font-persian` → **Vazirmatn** (already stacks in `font-sans`).
* Always load both `@font-face` families (see `src/index.css` for the full weight list:
  100–900). Use `font-display: swap`.

## Rules
1. Any user-facing string must go through `t()` — never hard-code copy in JSX.
2. Add `font-persian` to body copy, descriptions, toasts and modal text so Farsi wraps
   and renders correctly.
3. Use logical properties / flex so RTL "just works": the design is symmetric, so most
   layouts flip automatically once `dir="rtl"` is set. Icons stay LTR.
4. Keep status pills/mono labels (`font-mono`) LTR even in RTL (version, FPS, shortcuts).

## Example translations map (extend as needed)
```ts
export const translations = {
  en: { soundPad: 'SoundPad', settings: 'Settings', cancel: 'Cancel', confirmDelete: 'Delete' },
  fa: { soundPad: 'پد صدا',  settings: 'تنظیمات', cancel: 'انصراف', confirmDelete: 'حذف' },
};
```

## First-run language picker
Original shows `LanguageSelectorModal` on first launch (`!localStorage.hasPickedLanguage`).
Mirror that: pick language → then show help/onboarding.
