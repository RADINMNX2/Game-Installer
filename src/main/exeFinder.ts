import fs from 'node:fs'
import path from 'node:path'
import type { ExeCandidate } from '@shared/types'

const DIR_HINTS = ['bin', 'release', 'x64', 'win64', 'x86', 'game', 'build', 'app', 'runtime', 'english', 'binaries']
const DIR_AVOID = ['redist', 'vcredist', 'directx', '_commonredist', 'commonredist', 'support', 'launcher', 'patch', 'crack', '__macosx', 'documents', 'docs']

function score(name: string, relDir: string, size: number, gameName: string): number {
  const lower = name.toLowerCase()
  const dir = relDir.toLowerCase()
  let s = 0
  // Match game base name
  if (gameName && lower.includes(gameName.toLowerCase())) s += 100
  // Prefer known game binary folders
  for (const h of DIR_HINTS) if (dir.includes(h)) s += 30
  for (const a of DIR_AVOID) if (dir.includes(a)) s -= 50
  // Avoid common installers / uninstallers / helpers
  if (/(uninstall|vcredist|directx|setup|install|redist|dxweb|dotnet|visual|c\+\+)/i.test(lower)) s -= 40
  // Prefer larger files (real game binaries are usually big)
  if (size > 5 * 1024 * 1024) s += Math.min(20, Math.floor(size / (50 * 1024 * 1024)))
  return s
}

function walk(dir: string, depth: number, out: string[]): void {
  if (depth <= 0) return
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, depth - 1, out)
    else if (e.isFile() && e.name.toLowerCase().endsWith('.exe')) out.push(full)
  }
}

export function findExes(root: string, gameName = ''): ExeCandidate[] {
  const files: string[] = []
  walk(root, 6, files)
  const results: ExeCandidate[] = []
  for (const full of files) {
    const name = path.basename(full)
    const lower = name.toLowerCase()
    if (/(uninstall|vcredist|dxweb|dotnet)/i.test(lower)) continue
    let size = 0
    try {
      size = fs.statSync(full).size
    } catch {
      /* ignore */
    }
    const relDir = path.relative(root, path.dirname(full))
    results.push({
      path: full,
      name,
      size,
      relativeDir: relDir || '.',
      priority: score(name, relDir, size, gameName),
    })
  }
  results.sort((a, b) => b.priority - a.priority || b.size - a.size)
  return results
}
