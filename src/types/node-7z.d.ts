declare module 'node-7z' {
  interface SevenZipStream {
    on(event: 'progress', cb: (progress: { percent?: number; fileCount?: number }) => void): SevenZipStream
    on(event: 'data', cb: (file: { file?: string; status?: string }) => void): SevenZipStream
    on(event: 'end', cb: () => void): SevenZipStream
    on(event: 'error', cb: (err: Error & { stderr?: string; code?: string }) => void): SevenZipStream
  }
  interface SevenZip {
    extract(source: string, target: string, options?: Record<string, unknown>): SevenZipStream
    add(target: string, source: string | string[], options?: Record<string, unknown>): SevenZipStream
    delete(target: string, files: string | string[], options?: Record<string, unknown>): SevenZipStream
    list(target: string, options?: Record<string, unknown>): SevenZipStream
  }
  const Seven: SevenZip
  export default Seven
}
