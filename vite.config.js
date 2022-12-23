import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    sourcemap: 'inline',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'content.html'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [
    // Copies manifest.json to dist/manifest.json
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        }
      ]
    })
  ]
})
