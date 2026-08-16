import type { GameInstallerApi } from '../preload/index'

declare global {
  interface Window {
    gi: GameInstallerApi
  }
}

export {}
