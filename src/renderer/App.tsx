import { useEffect, useState } from 'react'
import { Gamepad2, Palette, Minus, Square, X } from 'lucide-react'
import TitleBar from './components/TitleBar'
import LoadingScreen from './components/LoadingScreen'
import InstallerView from './views/InstallerView'
import ThemesView from './views/ThemesView'
import { applyTheme } from './lib/theme'
import type { ThemeInfo } from '@shared/types'

function WindowControls() {
  return (
    <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
      <button
        onClick={() => window.gi.minimize()}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={() => window.gi.toggleMaximize()}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Square size={13} />
      </button>
      <button
        onClick={() => window.gi.close()}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [tab, setTab] = useState<'install' | 'themes'>('install')
  const [themes, setThemes] = useState<ThemeInfo[]>([])
  const [activeThemeId, setActiveThemeId] = useState<string>('neonred')

  useEffect(() => {
    window.gi.listThemes().then(setThemes).catch(() => {})
    const saved = localStorage.getItem('gi_theme') || 'neonred'
    setActiveThemeId(saved)
    window.gi.loadTheme(saved).then((t) => {
      if (t) applyTheme(t)
    })
  }, [])

  const changeTheme = async (id: string) => {
    const t = await window.gi.loadTheme(id)
    if (t) {
      applyTheme(t)
      setActiveThemeId(id)
      localStorage.setItem('gi_theme', id)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
      {!booted && (
        <LoadingScreen
          brand="GAME INSTALLER"
          brandColor="#ef4444"
          subtitle="Game Installer Engine"
          onComplete={() => setBooted(true)}
        />
      )}

      <TitleBar
        draggable
        tabs={[
          { id: 'install', label: 'نصب بازی', icon: <Gamepad2 size={18} /> },
          { id: 'themes', label: 'تم‌ها', icon: <Palette size={18} /> },
        ]}
        activeTab={tab}
        onTabChange={(id) => setTab(id as 'install' | 'themes')}
        left={
          <div className="flex items-center gap-2 pr-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <Gamepad2 size={16} className="text-white" />
            </div>
            <span className="font-bold tracking-wide text-sm">Game Installer</span>
          </div>
        }
        right={<WindowControls />}
      />

      <div className="flex-1 overflow-hidden">
        {tab === 'install' ? (
          <InstallerView />
        ) : (
          <ThemesView themes={themes} activeId={activeThemeId} onSelect={changeTheme} />
        )}
      </div>
    </div>
  )
}
