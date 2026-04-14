import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const assetManifestFileName = 'asset-manifest.json'

type HtmlAssetManifest = {
  generatedAt: string
  entry: {
    script: string
    styles: string[]
  }
}

const extractBuildManifest = (indexHtml: string): HtmlAssetManifest => {
  const scriptMatch = indexHtml.match(
    /<script\b[^>]*type="module"[^>]*src="([^"]*assets\/[^"]+\.js)"[^>]*><\/script>/i,
  )

  if (!scriptMatch) {
    throw new Error('Failed to locate the built entry script in dist/index.html.')
  }

  const styles = [
    ...new Set(
      [...indexHtml.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]*assets\/[^"]+\.css)"[^>]*>/gi)].map(
        (match) => match[1],
      ),
    ),
  ]

  return {
    generatedAt: new Date().toISOString(),
    entry: {
      script: scriptMatch[1],
      styles,
    },
  }
}

const stripGeneratedAssetTags = (indexHtml: string) =>
  indexHtml
    .replace(/\s*<link\b[^>]*rel="modulepreload"[^>]*href="[^"]*assets\/[^"]+"[^>]*>\s*/gi, '\n')
    .replace(/\s*<link\b[^>]*rel="stylesheet"[^>]*href="[^"]*assets\/[^"]+\.css"[^>]*>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*type="module"[^>]*src="[^"]*assets\/[^"]+\.js"[^>]*><\/script>\s*/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')

const createRuntimeLoader = () =>
  [
    '<script type="module">',
    '(() => {',
    "  const bootPanel = document.querySelector('[data-boot-panel]');",
    "  const bootEyebrow = document.querySelector('[data-boot-eyebrow]');",
    "  const bootTitle = document.querySelector('[data-boot-title]');",
    "  const bootTip = document.querySelector('[data-boot-tip]');",
    '',
    '  const showBootError = (message, error) => {',
    "    console.error('[boot-loader] Failed to start app shell.', error);",
    '    if (bootPanel) {',
    "      bootPanel.classList.add('boot-loading__panel--error');",
    '    }',
    '    if (bootEyebrow) {',
    "      bootEyebrow.textContent = 'ERROR';",
    '    }',
    '    if (bootTitle) {',
    "      bootTitle.textContent = '页面资源加载失败';",
    '    }',
    '    if (bootTip) {',
    "      bootTip.textContent = `${message} 请稍后重试或联系管理员。`;",
    '    }',
    '  };',
    '',
    '  const resolveRuntimeUrl = (value, addCacheBust = false) => {',
    '    const url = new URL(value, document.baseURI || window.location.href);',
    '    if (addCacheBust) {',
    "      url.searchParams.set('t', `${Date.now()}`);",
    '    }',
    '    return url.toString();',
    '  };',
    '',
    '  const loadStyles = async (styles) => {',
    '    await Promise.all(',
    '      styles.map(',
    '        (href) =>',
    '          new Promise((resolve, reject) => {',
    '            const absoluteHref = resolveRuntimeUrl(href);',
    '            const existingLink = document.querySelector(`link[rel="stylesheet"][href="${absoluteHref}"]`);',
    '',
    '            if (existingLink) {',
    '              resolve();',
    '              return;',
    '            }',
    '',
    "            const link = document.createElement('link');",
    "            link.rel = 'stylesheet';",
    '            link.href = absoluteHref;',
    '            link.onload = () => resolve();',
    "            link.onerror = () => reject(new Error(`样式资源加载失败：${href}`));",
    '            document.head.appendChild(link);',
    '          }),',
    '      ),',
    '    );',
    '  };',
    '',
    '  const bootstrap = async () => {',
    `    const manifestUrl = resolveRuntimeUrl(${JSON.stringify(assetManifestFileName)}, true);`,
    "    const response = await fetch(manifestUrl, { cache: 'no-store' });",
    '',
    '    if (!response.ok) {',
    "      throw new Error(`资源清单请求失败（${response.status}）`);",
    '    }',
    '',
    '    const manifest = await response.json();',
    "    const entry = manifest && typeof manifest === 'object' ? manifest.entry : null;",
    "    const entryScript = entry && typeof entry.script === 'string' ? entry.script.trim() : '';",
    "    const entryStyles = entry && Array.isArray(entry.styles)",
    "      ? entry.styles.filter((item) => typeof item === 'string' && item.trim().length > 0)",
    '      : [];',
    '',
    '    if (!entryScript) {',
    "      throw new Error('资源清单缺少入口脚本');",
    '    }',
    '',
    '    await loadStyles(entryStyles);',
    '    await import(resolveRuntimeUrl(entryScript));',
    '  };',
    '',
    '  bootstrap().catch((error) => {',
    "    const message = error instanceof Error ? error.message : '无法加载最新页面资源。';",
    '    showBootError(message, error);',
    '  });',
    '})();',
    '</script>',
  ].join('\n')

const runtimeAssetShellPlugin = (): Plugin => {
  let resolvedConfig: ResolvedConfig

  return {
    name: 'runtime-asset-shell',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
    },
    closeBundle() {
      const distDir = resolve(resolvedConfig.root, resolvedConfig.build.outDir)
      const indexHtmlPath = resolve(distDir, 'index.html')
      const assetManifestPath = resolve(distDir, assetManifestFileName)

      if (!existsSync(indexHtmlPath)) {
        throw new Error('Failed to locate dist/index.html after build.')
      }

      const indexHtml = readFileSync(indexHtmlPath, 'utf8')
      const buildManifest = extractBuildManifest(indexHtml)
      const rewrittenHtml = stripGeneratedAssetTags(indexHtml).replace(
        '</body>',
        `${createRuntimeLoader()}\n  </body>`,
      )

      writeFileSync(assetManifestPath, `${JSON.stringify(buildManifest, null, 2)}\n`, 'utf8')
      writeFileSync(indexHtmlPath, rewrittenHtml, 'utf8')
    },
  }
}

const preserveDistConfigPlugin = (): Plugin => {
  let resolvedConfig: ResolvedConfig
  let previousConfigContent: string | null = null
  const configFileName = 'config.yaml'

  return {
    name: 'preserve-dist-config',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
      const distConfigPath = resolve(config.root, config.build.outDir, configFileName)
      if (existsSync(distConfigPath)) {
        previousConfigContent = readFileSync(distConfigPath, 'utf8')
      }
    },
    closeBundle() {
      const distDir = resolve(resolvedConfig.root, resolvedConfig.build.outDir)
      const distConfigPath = resolve(distDir, configFileName)

      if (previousConfigContent !== null) {
        writeFileSync(distConfigPath, previousConfigContent, 'utf8')
        return
      }

      const sourceConfigPath = resolve(resolvedConfig.root, 'public', configFileName)
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
  plugins: [vue(), runtimeAssetShellPlugin(), preserveDistConfigPlugin()],
})
