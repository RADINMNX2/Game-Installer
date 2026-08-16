import fs from 'node:fs'
import path from 'node:path'
import ws from 'windows-shortcuts'
import type { ShortcutResult } from '@shared/types'

function safeFileName(name: string): string {
  const cleaned = name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim()
  return cleaned || 'Game'
}

function uniquePath(desktop: string, base: string): string {
  let target = path.join(desktop, `${base}.lnk`)
  let i = 2
  while (fs.existsSync(target)) {
    target = path.join(desktop, `${base} (${i}).lnk`)
    i++
  }
  return target
}

export function createDesktopShortcut(
  exePath: string,
  gameName: string,
  desktop: string
): Promise<ShortcutResult> {
  return new Promise((resolve) => {
    const target = uniquePath(desktop, safeFileName(gameName))
    ws.create(
      target,
      {
        target: exePath,
        icon: exePath, // extract icon from the executable itself
        iconIndex: 0,
        windowMode: 'normal',
        description: `Launch ${gameName}`,
      },
      (err: Error | null) => {
        if (err) {
          resolve({ success: false, error: err.message })
        } else {
          resolve({ success: true, path: target })
        }
      }
    )
  })
}
