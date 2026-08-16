import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: { '@shared': new URL('./src/shared', import.meta.url).pathname }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: { '@shared': new URL('./src/shared', import.meta.url).pathname }
    }
  },
  renderer: {
    root: 'src/renderer',
    resolve: {
      alias: {
        '@shared': new URL('./src/shared', import.meta.url).pathname,
        '@components': new URL('./src/renderer/components', import.meta.url).pathname
      }
    },
    plugins: [react()]
  }
})
