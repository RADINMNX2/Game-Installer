import { useEffect, useState } from 'react'
import { Palette, Check } from 'lucide-react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import type { AppliedTheme, ThemeInfo } from '@shared/types'

interface Props {
  themes: ThemeInfo[]
  activeId: string
  onSelect: (id: string) => void
}

export default function ThemesView({ themes, activeId, onSelect }: Props) {
  const [details, setDetails] = useState<Record<string, AppliedTheme | null>>({})

  useEffect(() => {
    let alive = true
    themes.forEach((t) => {
      window.gi.loadTheme(t.path).then((d) => {
        if (alive) setDetails((p) => ({ ...p, [t.path]: d }))
      })
    })
    return () => {
      alive = false
    }
  }, [themes])

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
              <Palette size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="font-bold font-persian">موتور تم (Theme Engine)</h2>
              <p className="text-xs text-gray-500 font-persian">
                تم‌های سفارشی را به صورت <code className="font-mono">theme.json</code> در پوشه
                <code className="font-mono"> ai </code> یا <code className="font-mono">themes</code> قرار دهید.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((t) => {
            const d = details[t.path]
            const active = activeId === t.path
            return (
              <Card
                key={t.path}
                selected={active}
                interactive
                onClick={() => onSelect(t.path)}
                className="p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold font-persian">{t.name}</span>
                  {active && (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                      <Check size={14} /> فعال
                    </span>
                  )}
                </div>
                {d ? (
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      {[d.primary, d.accent, d.surface, d.text].map((c, i) => (
                        <div
                          key={i}
                          className="flex-1 h-8 rounded-lg border border-white/10"
                          style={{ background: c }}
                          title={c}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono truncate">{d.fontMain.split(',')[0]}</span>
                      <Badge tone="neutral">{d.borderRadius}</Badge>
                    </div>
                    {d.backgroundImage && <Badge tone="info">پس‌زمینه تصویری</Badge>}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 font-persian">در حال بارگذاری…</p>
                )}
              </Card>
            )
          })}
        </div>

        {themes.length === 0 && (
          <p className="text-center text-sm text-gray-500 font-persian">
            هیچ تمی یافت نشد. تم پیش‌فرض NeonRed فعال است.
          </p>
        )}
      </div>
    </div>
  )
}
