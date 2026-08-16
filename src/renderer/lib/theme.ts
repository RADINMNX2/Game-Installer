import type { AppliedTheme } from '@shared/types'

const DYNAMIC_STYLE_ID = 'gi-theme-override'

const OVERRIDE_CSS = `
html.gi-themed .bg-red-600 { background-color: var(--theme-primary) !important; }
html.gi-themed .hover\\:bg-red-500:hover { background-color: var(--theme-primary-hover) !important; }
html.gi-themed .text-red-500 { color: var(--theme-primary) !important; }
html.gi-themed .border-red-500 { border-color: var(--theme-primary) !important; }
html.gi-themed .border-red-500\\/20 { border-color: color-mix(in srgb, var(--theme-primary) 20%, transparent) !important; }
html.gi-themed .border-red-500\\/30 { border-color: color-mix(in srgb, var(--theme-primary) 30%, transparent) !important; }
html.gi-themed .from-red-600 {
  --tw-gradient-from: var(--theme-primary) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
html.gi-themed .to-orange-500 {
  --tw-gradient-to: var(--theme-primary-hover) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
html.gi-themed .shadow-red-900\\/30 { box-shadow: 0 10px 30px -5px color-mix(in srgb, var(--theme-primary) 30%, transparent) !important; }
html.gi-themed .shadow-red-900\\/40 { box-shadow: 0 10px 30px -5px color-mix(in srgb, var(--theme-primary) 40%, transparent) !important; }
`

function injectDynamicStyle(): void {
  if (document.getElementById(DYNAMIC_STYLE_ID)) return
  const el = document.createElement('style')
  el.id = DYNAMIC_STYLE_ID
  el.textContent = OVERRIDE_CSS
  document.head.appendChild(el)
}

function removeDynamicStyle(): void {
  const el = document.getElementById(DYNAMIC_STYLE_ID)
  if (el) el.remove()
}

export function applyTheme(theme: AppliedTheme): void {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', theme.primary)
  root.style.setProperty('--theme-primary-hover', theme.primaryHover)
  root.style.setProperty('--theme-accent', theme.accent)
  root.style.setProperty('--theme-font-main', theme.fontMain)
  root.style.setProperty('--theme-border-radius', theme.borderRadius)

  document.body.style.fontFamily = theme.fontMain
  document.body.style.backgroundImage = theme.backgroundImage || 'none'

  if (theme.id === 'neonred') {
    root.classList.remove('gi-themed')
    removeDynamicStyle()
  } else {
    root.classList.add('gi-themed')
    injectDynamicStyle()
  }
}
