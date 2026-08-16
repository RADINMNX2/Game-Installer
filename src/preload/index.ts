import { contextBridge, ipcRenderer } from 'electron'
import type {
  ArchiveSet,
  ExeCandidate,
  ShortcutResult,
  ThemeInfo,
  AppliedTheme,
  ExtractProgress,
} from '@shared/types'

export interface GameInstallerApi {
  selectFolder: () => Promise<string | null>
  getPaths: () => Promise<{ desktop: string; tempRoot: string }>
  scan: (folder: string) => Promise<ArchiveSet[]>
  extract: (set: ArchiveSet, password?: string) => Promise<string>
  onExtractProgress: (cb: (p: ExtractProgress) => void) => () => void
  findExes: (folder: string, gameName?: string) => Promise<ExeCandidate[]>
  createShortcut: (exePath: string, gameName: string) => Promise<ShortcutResult>
  openFolder: (p: string) => Promise<boolean>
  listThemes: () => Promise<ThemeInfo[]>
  loadTheme: (id: string) => Promise<AppliedTheme | null>
  minimize: () => void
  toggleMaximize: () => void
  close: () => void
}

const api: GameInstallerApi = {
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  getPaths: () => ipcRenderer.invoke('app:paths'),
  scan: (folder) => ipcRenderer.invoke('archive:scan', folder),
  extract: (set, password) => ipcRenderer.invoke('archive:extract', set, password),
  onExtractProgress: (cb) => {
    const listener = (_e: unknown, data: ExtractProgress) => cb(data)
    ipcRenderer.on('archive:progress', listener)
    return () => ipcRenderer.removeListener('archive:progress', listener)
  },
  findExes: (folder, gameName) => ipcRenderer.invoke('exe:find', folder, gameName),
  createShortcut: (exePath, gameName) => ipcRenderer.invoke('shortcut:create', exePath, gameName),
  openFolder: (p) => ipcRenderer.invoke('fs:openFolder', p),
  listThemes: () => ipcRenderer.invoke('theme:list'),
  loadTheme: (id) => ipcRenderer.invoke('theme:load', id),
  minimize: () => ipcRenderer.send('window:minimize'),
  toggleMaximize: () => ipcRenderer.send('window:toggleMaximize'),
  close: () => ipcRenderer.send('window:close'),
}

contextBridge.exposeInMainWorld('gi', api)
