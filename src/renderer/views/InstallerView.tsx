import { useCallback, useMemo, useState } from 'react'
import {
  FolderOpen, Archive, Rocket, RefreshCw, FileSearch,
  KeyRound, CheckCircle2, AlertTriangle, FolderOutput,
} from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import Badge from '../components/Badge'
import Input from '../components/Input'
import { useToast } from '../components/Toast'
import type { ArchiveSet, ExeCandidate, ExtractProgress } from '@shared/types'

function formatBytes(n: number): string {
  if (!n) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)))
  return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`
}

type Phase = 'idle' | 'scanning' | 'ready' | 'extracting' | 'extractError' | 'extracted' | 'shortcutDone'

export default function InstallerView() {
  const toast = useToast()
  const [folder, setFolder] = useState<string | null>(null)
  const [sets, setSets] = useState<ArchiveSet[]>([])
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState<ExtractProgress | null>(null)
  const [extractDest, setExtractDest] = useState<string | null>(null)
  const [exes, setExes] = useState<ExeCandidate[]>([])
  const [selectedExe, setSelectedExe] = useState<string | null>(null)

  const selectedSet = useMemo(
    () => sets.find((s) => s.id === selectedSetId) ?? null,
    [sets, selectedSetId]
  )
  const gameName = selectedSet?.baseName || folder?.split(/[\\/]/).pop() || 'Game'

  const handleSelectFolder = useCallback(async () => {
    const f = await window.gi.selectFolder()
    if (!f) return
    setFolder(f)
    setSets([])
    setSelectedSetId(null)
    setExtractDest(null)
    setExes([])
    setSelectedExe(null)
    setPhase('scanning')
    try {
      const result = await window.gi.scan(f)
      setSets(result)
      if (result.length > 0) {
        setSelectedSetId(result[0].id) // recommended = largest
        setPhase('ready')
      } else {
        setPhase('idle')
        toast.warning('هیچ آرشیوی یافت نشد', 'در این پوشه پارتی شناسایی نشد.')
      }
    } catch (e) {
      setPhase('idle')
      toast.error('خطا در اسکن پوشه', String(e))
    }
  }, [toast])

  const handleExtract = useCallback(async () => {
    if (!selectedSet) return
    setPhase('extracting')
    setProgress({ setId: selectedSet.id, currentFile: '', extracted: 0, total: selectedSet.totalSize, percent: 0, phase: 'preparing' })
    const off = window.gi.onExtractProgress((p) => setProgress(p))
    try {
      const dest = await window.gi.extract(selectedSet, password || undefined)
      setExtractDest(dest)
      const found = await window.gi.findExes(dest, selectedSet.baseName)
      setExes(found)
      setSelectedExe(found[0]?.path ?? null)
      setPhase('extracted')
      toast.success('استخراج کامل شد', `${found.length} فایل اجرایی پیدا شد.`)
    } catch (e) {
      setPhase('extractError')
      toast.error('خطا در استخراج', String(e))
    } finally {
      off()
    }
  }, [selectedSet, password, toast])

  const handleShortcut = useCallback(async () => {
    if (!selectedExe) return
    const res = await window.gi.createShortcut(selectedExe, gameName)
    if (res.success) {
      setPhase('shortcutDone')
      toast.success('شورت‌کات ساخته شد', res.path)
    } else {
      toast.error('خطا در ساخت شورت‌کات', res.error)
    }
  }, [selectedExe, gameName, toast])

  const reset = useCallback(() => {
    setPhase('idle')
    setSets([])
    setSelectedSetId(null)
    setExtractDest(null)
    setExes([])
    setSelectedExe(null)
    setProgress(null)
    setPassword('')
  }, [])

  return (
    <div className="h-full overflow-y-auto px-6 py-6" style={{ contentVisibility: 'auto' }}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Step 1: source folder */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
              <FolderOpen size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="font-bold font-persian">۱. انتخاب پوشه بازی</h2>
              <p className="text-xs text-gray-500 font-persian">پوشه‌ای که پارت‌های ZIP/RAR در آن قرار دارند</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button icon={<FolderOpen size={16} />} onClick={handleSelectFolder}>
              انتخاب پوشه
            </Button>
            {folder && <span className="text-xs text-gray-400 font-mono truncate">{folder}</span>}
            {phase === 'scanning' && <Badge tone="info">در حال اسکن…</Badge>}
          </div>
        </Card>

        {/* Step 2: detected sets */}
        {sets.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                <Archive size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-bold font-persian">۲. مجموعه پارت‌های شناسایی‌شده</h2>
                <p className="text-xs text-gray-500 font-persian">بزرگ‌ترین مجموعه به‌عنوان پیش‌فرض انتخاب شده</p>
              </div>
            </div>
            <div className="space-y-2">
              {sets.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedSetId(s.id); setExtractDest(null); setExes([]); setSelectedExe(null); setPhase('ready') }}
                  className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between gap-3
                    ${selectedSetId === s.id ? 'bg-red-900/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-zinc-900/40 border-white/5 hover:border-red-500/40'}`}
                >
                  <div className="min-w-0">
                    <p className="font-bold font-persian truncate">{s.baseName}</p>
                    <p className="text-xs text-gray-500 font-mono">{s.parts.length} پارت • {formatBytes(s.totalSize)}</p>
                  </div>
                  <Badge tone={s.type === 'rar' ? 'primary' : s.type === 'zip' ? 'info' : 'neutral'}>
                    {s.type.toUpperCase()}
                  </Badge>
                </button>
              ))}
            </div>

            {(phase === 'ready' || phase === 'extractError') && (
              <div className="mt-4 space-y-3">
                {phase === 'extractError' && (
                  <div className="flex items-start gap-2 p-3 rounded-xl border"
                       style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)', color: '#fca5a5' }}>
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <div className="text-xs font-persian">
                      استخراج ناموفق بود. در صورت پسوردخورده بودن، پسورد را وارد کنید و دوباره تلاش کنید؛ در غیر این صورت پارت خراب را جایگزین نمایید.
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    placeholder="پسورد آرشیو (در صورت نیاز)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button
                  fullWidth
                  size="lg"
                  icon={<Rocket size={18} />}
                  onClick={handleExtract}
                  variant={phase === 'extractError' ? 'danger' : 'primary'}
                >
                  {phase === 'extractError' ? 'تلاش مجدد' : 'استخراج و نصب'}
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Step 3: extraction progress */}
        {phase === 'extracting' && (
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                <Archive size={18} className="text-red-500 animate-pulse" />
              </div>
              <div>
                <h2 className="font-bold font-persian">۳. در حال استخراج…</h2>
                <p className="text-xs text-gray-500 font-mono truncate">{progress?.currentFile}</p>
              </div>
            </div>
            <ProgressBar percent={progress?.percent ?? 0} height="h-4" />
            <p className="text-center mt-2 text-2xl font-black font-mono text-red-500">
              {Math.floor(progress?.percent ?? 0)}%
            </p>
          </Card>
        )}

        {/* Step 4: choose executable */}
        {phase === 'extracted' && (
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                <FileSearch size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-bold font-persian">۴. فایل اجرایی را انتخاب کنید</h2>
                <p className="text-xs text-gray-500 font-persian">
                  {exes.length > 1 ? 'چندین فایل پیدا شد — موردی که با نام بازی مطابقت دارد پیشنهاد شده' : 'فایل اجرایی پیدا شد'}
                </p>
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {exes.map((x) => (
                <button
                  key={x.path}
                  onClick={() => setSelectedExe(x.path)}
                  className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between gap-3
                    ${selectedExe === x.path ? 'bg-red-900/30 border-red-500' : 'bg-zinc-900/40 border-white/5 hover:border-red-500/40'}`}
                >
                  <div className="min-w-0">
                    <p className="font-bold font-persian truncate">{x.name}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{x.relativeDir} • {formatBytes(x.size)}</p>
                  </div>
                  {selectedExe === x.path && <CheckCircle2 size={18} className="text-red-500 shrink-0" />}
                </button>
              ))}
            </div>
            {exes.length > 0 && (
              <Button fullWidth size="lg" icon={<KeyRound size={18} />} onClick={handleShortcut} className="mt-4">
                ساخت شورت‌کات روی دسکتاپ
              </Button>
            )}
          </Card>
        )}

        {/* Step 5: done */}
        {phase === 'shortcutDone' && (
          <Card className="p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-4">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h2 className="font-bold font-persian text-lg mb-1">نصب با موفقیت انجام شد!</h2>
            <p className="text-sm text-gray-400 font-persian mb-4">شورت‌کات بازی روی دسکتاپ ساخته شد.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" icon={<FolderOutput size={16} />} onClick={() => extractDest && window.gi.openFolder(extractDest)}>
                باز کردن پوشه
              </Button>
              <Button variant="ghost" icon={<RefreshCw size={16} />} onClick={reset}>
                نصب بازی دیگر
              </Button>
            </div>
          </Card>
        )}

        {(phase === 'extracted' || phase === 'shortcutDone') && extractDest && (
          <p className="text-center text-xs text-gray-600 font-mono break-all px-2">
            مقصد: {extractDest}
          </p>
        )}
      </div>
    </div>
  )
}
