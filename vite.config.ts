import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const preserveDistConfigPlugin = (): Plugin => {
  let resolvedConfig: ResolvedConfig
  let previousConfigContent: string | null = null

  return {
    name: 'preserve-dist-config',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
      const distConfigPath = resolve(config.root, config.build.outDir, 'config.json')
      if (existsSync(distConfigPath)) {
        previousConfigContent = readFileSync(distConfigPath, 'utf8')
      }
    },
    closeBundle() {
      const distDir = resolve(resolvedConfig.root, resolvedConfig.build.outDir)
      const distConfigPath = resolve(distDir, 'config.json')

      if (previousConfigContent !== null) {
        writeFileSync(distConfigPath, previousConfigContent, 'utf8')
        return
      }

      const sourceConfigPath = resolve(resolvedConfig.root, 'public', 'config.json')
      if (!existsSync(distConfigPath) && existsSync(sourceConfigPath)) {
        copyFileSync(sourceConfigPath, distConfigPath)
      }
    },
  }
}

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-main-[hash].js',
        chunkFileNames: 'assets/app-chunk-[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const assetName = (assetInfo.name ?? '').toLowerCase()

          if (assetName.endsWith('.css')) {
            return 'assets/app-style-[name]-[hash][extname]'
          }

          const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.ico', '.bmp', '.tif', '.tiff']
          if (imageExtensions.some((ext) => assetName.endsWith(ext))) {
            return 'assets/app-image-[name]-[hash][extname]'
          }

          const fontExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot']
          if (fontExtensions.some((ext) => assetName.endsWith(ext))) {
            return 'assets/app-font-[name]-[hash][extname]'
          }

          return 'assets/app-asset-[name]-[hash][extname]'
        },
      },
    },
  },
  plugins: [vue(), preserveDistConfigPlugin()],
})
