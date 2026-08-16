import fs from 'node:fs'
import path from 'node:path'
import Seven from 'node-7z'
import sevenBin from '7zip-bin'
import type { ArchivePart, ArchiveSet, ArchiveType, ExtractProgress } from '@shared/types'

interface Candidate {
  setKey: string
  order: number
  type: ArchiveType
  name: string
  fullPath: string
  size: number
}

const SINGLE_EXTS: Record<string, ArchiveType> = {
  rar: 'rar',
  zip: 'zip',
  '7z': 'zip',
  tar: 'zip',
  gz: 'zip',
  bz2: 'zip',
  iso: 'zip',
}

// Patterns tried in order. First match wins.
function classify(name: string): Omit<Candidate, 'name' | 'fullPath' | 'size'> | null {
  // Game.part1.rar / Game.part01.rar / Game.part1.zip
  let m = /^(.*?)\.part(\d+)\.(rar|zip|7z)$/i.exec(name)
  if (m) {
    const ext = m[3].toLowerCase()
    return { setKey: m[1], order: parseInt(m[2], 10), type: ext === 'rar' ? 'rar' : 'zip' }
  }
  // Game.r00 / Game.r01 ... (old RAR volume naming)
  m = /^(.*?)\.r(\d{2,})$/i.exec(name)
  if (m) return { setKey: m[1], order: parseInt(m[2], 10), type: 'rar' }
  // Game.001 / Game.002 ... (generic numeric split volume)
  m = /^(.*?)\.(\d{2,})$/i.exec(name)
  if (m) return { setKey: m[1], order: parseInt(m[2], 10), type: 'split' }
  // Single archive
  const ext = path.extname(name).slice(1).toLowerCase()
  if (SINGLE_EXTS[ext]) return { setKey: name.slice(0, name.length - ext.length - 1), order: -1, type: SINGLE_EXTS[ext] }
  return null
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
    else if (e.isFile()) out.push(full)
  }
}

export function scanArchives(folder: string): ArchiveSet[] {
  const files: string[] = []
  walk(folder, 3, files)
  const candidates: Candidate[] = []
  for (const full of files) {
    const name = path.basename(full)
    const c = classify(name)
    if (!c) continue
    candidates.push({ ...c, name, fullPath: full, size: safeSize(full) })
  }

  // Group by setKey
  const groups = new Map<string, Candidate[]>()
  for (const c of candidates) {
    const arr = groups.get(c.setKey) ?? []
    arr.push(c)
    groups.set(c.setKey, arr)
  }

  const sets: ArchiveSet[] = []
  for (const [baseName, parts] of groups) {
    // Drop lone numeric "split" false-positives (need >= 2 volumes, or archive-extension base)
    if (parts[0].type === 'split' && parts.length < 2 && !/\.(7z|rar|zip|tar|gz|bz2|iso)$/i.test(baseName)) {
      continue
    }
    const sorted = [...parts].sort((a, b) => volumeOrder(a.name) - volumeOrder(b.name))
    const type: ArchiveType = sorted[0].type
    const archiveParts: ArchivePart[] = sorted.map((p) => ({
      name: p.name,
      path: p.fullPath,
      size: p.size,
    }))
    sets.push({
      id: baseName + '::' + folder,
      baseName: path.basename(baseName) || baseName,
      type,
      parts: archiveParts,
      totalSize: archiveParts.reduce((s, p) => s + p.size, 0),
    })
  }

  sets.sort((a, b) => b.totalSize - a.totalSize)
  return sets
}

function safeSize(full: string): number {
  try {
    return fs.statSync(full).size
  } catch {
    return 0
  }
}

export function firstPart(set: ArchiveSet): ArchivePart {
  return [...set.parts].sort((a, b) => volumeOrder(a.name) - volumeOrder(b.name))[0]
}

function volumeOrder(name: string): number {
  let m = /\.part(\d+)\./i.exec(name)
  if (m) return parseInt(m[1], 10)
  m = /\.r(\d{2,})$/i.exec(name)
  if (m) return parseInt(m[1], 10)
  m = /\.(\d{2,})$/i.exec(name)
  if (m) return parseInt(m[1], 10)
  return 0
}

export interface ExtractOptions {
  onProgress?: (p: ExtractProgress) => void
  password?: string
}

export function extractSet(
  set: ArchiveSet,
  dest: string,
  opts: ExtractOptions = {}
): Promise<string> {
  const part = firstPart(set)
  fs.mkdirSync(dest, { recursive: true })
  return new Promise<string>((resolve, reject) => {
    const args: Record<string, unknown> = { $progress: true, $bin: sevenBin.path7za }
    if (opts.password) args.$password = opts.password

    opts.onProgress?.({
      setId: set.id,
      currentFile: part.name,
      extracted: 0,
      total: set.totalSize,
      percent: 0,
      phase: 'preparing',
    })

    const stream = Seven.extract(part.path, dest, args as any)
    stream.on('progress', (progress: { percent?: number }) => {
      opts.onProgress?.({
        setId: set.id,
        currentFile: part.name,
        extracted: 0,
        total: set.totalSize,
        percent: typeof progress.percent === 'number' ? progress.percent : 0,
        phase: 'extracting',
      })
    })
    stream.on('data', (file: { file?: string }) => {
      if (file?.file) {
        opts.onProgress?.({
          setId: set.id,
          currentFile: file.file,
          extracted: 0,
          total: set.totalSize,
          percent: 0,
          phase: 'extracting',
        })
      }
    })
    stream.on('end', () => {
      opts.onProgress?.({
        setId: set.id,
        currentFile: '',
        extracted: set.totalSize,
        total: set.totalSize,
        percent: 100,
        phase: 'done',
      })
      resolve(dest)
    })
    stream.on('error', (err: Error & { code?: string; stderr?: string }) => {
      const message = describe7zError(err, set)
      opts.onProgress?.({
        setId: set.id,
        currentFile: '',
        extracted: 0,
        total: set.totalSize,
        percent: 0,
        phase: 'error',
        error: message,
      })
      reject(new Error(message))
    })
  })
}

function describe7zError(err: Error & { code?: string; stderr?: string }, set: ArchiveSet): string {
  const stderr = (err.stderr || '').toLowerCase()
  const msg = (err.message || '').toLowerCase()
  if (stderr.includes('wrong password') || msg.includes('wrong password') || stderr.includes('encrypted')) {
    return `پارت‌ها پسورد دارند یا پسورد اشتباه است. لطفاً پسورد صحیح را وارد کنید. (${set.baseName})`
  }
  if (stderr.includes('cannot open') || stderr.includes('no such file') || msg.includes('cannot open')) {
    return `یکی از پارت‌ها یافت نشد یا خراب است. لطفاً پارت مربوطه را جایگزین کنید. (${set.baseName})`
  }
  if (stderr.includes(' CRC ') || stderr.includes('data error') || msg.includes('crc')) {
    return `پارت خراب است (خطای CRC). لطفاً پارت آسیب‌دیده را دوباره دانلود و جایگزین کنید. (${set.baseName})`
  }
  return `خطا در استخراج: ${err.message || 'unknown'}`
}
