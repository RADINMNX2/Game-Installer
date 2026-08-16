export type ArchiveType = 'zip' | 'rar' | 'split' | 'unknown'

export interface ArchivePart {
  name: string
  path: string
  size: number
}

export interface ArchiveSet {
  id: string
  baseName: string
  type: ArchiveType
  parts: ArchivePart[]
  totalSize: number
}

export interface ExeCandidate {
  path: string
  name: string
  size: number
  relativeDir: string
  priority: number
}

export interface ExtractProgress {
  setId: string
  currentFile: string
  extracted: number
  total: number
  percent: number
  phase: 'preparing' | 'extracting' | 'done' | 'error'
  error?: string
}

export interface ThemeColors {
  primary?: string
  secondary?: string
  accent?: string
  text?: string
  card?: string
}

export interface ThemeFonts {
  main?: string
  mono?: string
}

export interface GameTheme {
  name: string
  colors?: ThemeColors
  fonts?: ThemeFonts
  borderRadius?: string
  backgroundImage?: string
}

export interface ThemeInfo {
  name: string
  path: string
  file: string
}

export interface ShortcutResult {
  success: boolean
  path?: string
  error?: string
}

export interface AppliedTheme {
  id: string
  name: string
  primary: string
  primaryHover: string
  accent: string
  background: string
  surface: string
  text: string
  fontMain: string
  fontMono: string
  borderRadius: string
  backgroundImage?: string
}
