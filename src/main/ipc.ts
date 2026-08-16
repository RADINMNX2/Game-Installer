import { ipcMain, dialog, shell, app, BrowserWindow } from 'electron'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { scanArchives, extractSet } from './archive'
import { findExes } from './exeFinder'
import { createDesktopShortcut } from './shortcut'
import { listThemes, loadTheme } from './theme'
import type { ArchiveSet, ExtractProgress } from '@shared/types'

function tempRoot(): string {
  return process.env.GAME_INSTALLER_TEMP || path.join(os.tmpdir(), 'GameInstaller')
}

function safeGameName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, '_').trim() || 'Game'
}

export function registerIpc(): void {
  ipcMain.handle('dialog:selectFolder', async () => {
    const res = await dialog.showOpenDialog({
      title: 'انتخاب پوشه بازی (حاوی پارت‌ها)',
      properties: ['openDirectory'],
    })
    if (res.canceled || res.filePaths.length === 0) return null
    return res.filePaths[0]
  })

  ipcMain.handle('app:paths', () => ({
    desktop: app.getPath('desktop'),
    tempRoot: tempRoot(),
  }))

  ipcMain.handle('archive:scan', (_e, folder: string): ArchiveSet[] => {
    return scanArchives(folder)
  })

  ipcMain.handle(
    'archive:extract',
    async (event, set: ArchiveSet, password?: string): Promise<string> => {
      const dest = path.join(tempRoot(), 'Temp', safeGameName(set.baseName))
      fs.mkdirSync(dest, { recursive: true })
      await extractSet(set, dest, {
        password,
        onProgress: (p: ExtractProgress) => event.sender.send('archive:progress', p),
      })
      return dest
    }
  )

  ipcMain.handle('exe:find', (_e, folder: string, gameName?: string) => {
    return findExes(folder, gameName)
  })

  ipcMain.handle('shortcut:create', async (_e, exePath: string, gameName: string) => {
    return createDesktopShortcut(exePath, gameName, app.getPath('desktop'))
  })

  ipcMain.handle('fs:openFolder', async (_e, p: string) => {
    try {
      await shell.openPath(p)
      return true
    } catch {
      return false
    }
  })

  ipcMain.handle('theme:list', () => listThemes())
  ipcMain.handle('theme:load', (_e, id: string) => loadTheme(id))

  const winFrom = (e: { sender: Electron.WebContents }) => BrowserWindow.fromWebContents(e.sender)

  ipcMain.on('window:minimize', (e) => {
    const w = winFrom(e)
    if (w) w.minimize()
  })
  ipcMain.on('window:toggleMaximize', (e) => {
    const w = winFrom(e)
    if (w) (w.isMaximized() ? w.unmaximize() : w.maximize())
  })
  ipcMain.on('window:close', (e) => {
    const w = winFrom(e)
    if (w) w.close()
  })
}
