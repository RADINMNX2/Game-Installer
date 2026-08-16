declare module 'windows-shortcuts' {
  interface ShortcutOptions {
    target?: string
    args?: string
    cwd?: string
    icon?: string
    iconIndex?: number
    hotkey?: string
    windowMode?: 'normal' | 'max' | 'min' | number
    description?: string
    compatibility?: string
  }
  interface Shortcut {
    create(path: string, options: ShortcutOptions, cb: (err: Error | null) => void): void
    create(path: string, cb: (err: Error | null) => void): void
    edit(path: string, options: ShortcutOptions, cb: (err: Error | null) => void): void
    get(path: string, cb: (err: Error | null, result?: Record<string, unknown>) => void): void
  }
  const ws: Shortcut
  export default ws
}
