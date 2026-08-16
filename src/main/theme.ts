import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import type { AppliedTheme, GameTheme, ThemeInfo } from '@shared/types'

interface ThemeSearchDir {
  dir: string
  builtin?: boolean
}

function themeSearchDirs(): ThemeSearchDir[] {
  const root = app.isPackaged ? path.dirname(app.getAppPath()) : app.getAppPath()
  return [
    { dir: path.join(root, 'ai'), builtin: true },
    { dir: path.join(root, 'themes') },
    { dir: 'E:\\Prog\\Game Installer\\ai', builtin: true },
  ]
}

function walkForThemeFiles(dir: string, depth: number, out: string[]): void {
  if (depth <= 0) return
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue
      walkForThemeFiles(full, depth - 1, out)
    } else if (e.name === 'theme.json') {
      out.push(full)
    }
  }
}

function readTokensTheme(): AppliedTheme | null {
  for (const sd of themeSearchDirs()) {
    if (!sd.builtin) continue
    const p = path.join(sd.dir, 'theme', 'tokens.json')
    if (!fs.existsSync(p)) continue
    try {
      const t = JSON.parse(fs.readFileSync(p, 'utf-8'))
      const c = t.color || {}
      const f = (t.font && t.font.sans) || ['Inter', 'Vazirmatn', 'sans-serif']
      const fontMain = Array.isArray(f) ? f.join(', ') : String(f)
      return {
        id: 'neonred',
        name: t.name || 'NeonRed',
        primary: c.primary || '#ef4444',
        primaryHover: c.primaryHover || '#f87171',
        accent: c.accent || '#ff0000',
        background: c.background || '#050505',
        surface: c.surface || '#121212',
        text: c.textMain || '#ffffff',
        fontMain,
        fontMono: (t.font && t.font.mono) ? (Array.isArray(t.font.mono) ? t.font.mono.join(', ') : t.font.mono) : 'ui-monospace, monospace',
        borderRadius: (t.radius && t.radius.lg) || '1.25rem',
      }
    } catch {
      return null
    }
  }
  return null
}

export function listThemes(): ThemeInfo[] {
  const infos: ThemeInfo[] = []
  const builtin = readTokensTheme()
  if (builtin) infos.push({ name: builtin.name, path: builtin.id, file: 'tokens.json (built-in)' })

  const seen = new Set<string>()
  for (const sd of themeSearchDirs()) {
    const found: string[] = []
    walkForThemeFiles(sd.dir, 3, found)
    for (const fp of found) {
      if (seen.has(fp)) continue
      seen.add(fp)
      try {
        const raw = JSON.parse(fs.readFileSync(fp, 'utf-8')) as GameTheme
        const id = `user:${fp}`
        infos.push({ name: raw.name || path.basename(path.dirname(fp)), path: id, file: fp })
      } catch {
        /* skip invalid */
      }
    }
  }
  return infos
}

export function loadTheme(id: string): AppliedTheme | null {
  if (id === 'neonred') return readTokensTheme()

  if (id.startsWith('user:')) {
    const fp = id.slice('user:'.length)
    try {
      const raw = JSON.parse(fs.readFileSync(fp, 'utf-8')) as GameTheme
      const themeDir = path.dirname(fp)
      const colors = raw.colors || {}
      const fonts = raw.fonts || {}
      const bg = raw.backgroundImage
        ? 'url("' + path.join(themeDir, raw.backgroundImage).replace(/\\/g, '/').replace(/^/, 'file:///') + '")'
        : undefined
      return {
        id,
        name: raw.name || 'Custom',
        primary: colors.primary || '#ef4444',
        primaryHover: colors.accent || '#f87171',
        accent: colors.accent || '#ff0000',
        background: colors.primary ? '#050505' : '#050505',
        surface: colors.card || '#121212',
        text: colors.text || '#ffffff',
        fontMain: fonts.main ? `${fonts.main}, sans-serif` : 'Inter, Vazirmatn, sans-serif',
        fontMono: fonts.mono ? `${fonts.mono}, monospace` : 'ui-monospace, monospace',
        borderRadius: raw.borderRadius || '1.25rem',
        backgroundImage: bg,
      }
    } catch {
      return null
    }
  }
  return null
}
