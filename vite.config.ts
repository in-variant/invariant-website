import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { defineConfig, normalizePath, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function editorialDevContent(): Plugin {
  const articles = normalizePath(fileURLToPath(new URL('./src/data/industry-articles/', import.meta.url)))
  const otherSources = ['./src/pages/_data/glossary.json', './src/data/legacy-blog-articles.json', './src/data/blog-collections.json', './src/data/research-studies.json']
    .map(path => normalizePath(fileURLToPath(new URL(path, import.meta.url))))
  const script = fileURLToPath(new URL('./scripts/build-editorial-content.mjs', import.meta.url))
  const rebuild = () => execFileSync(process.execPath, [script], { stdio: 'inherit' })

  return {
    name: 'editorial-dev-content',
    apply: 'serve',
    configureServer(server) {
      if (!server.config.server.middlewareMode) {
        rebuild()
        server.watcher.add(otherSources)
      }
    },
    async handleHotUpdate({ file, read, server }) {
      if (server.config.server.middlewareMode || (!otherSources.includes(file) && !(file.startsWith(articles) && file.endsWith('.json')))) return
      await read()
      rebuild()
    },
  }
}

export default defineConfig({
  plugins: [react(), editorialDevContent()],
  base: '/',
  build: { manifest: true },
  server: {
    // Local stand-in for the Vercel function: node scripts/dev-api.mjs
    proxy: {
      '/api': 'http://localhost:8788',
    },
  },
})
