import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  base: './',
  server: {
    port: 5173
  },
  preview: {
    port: 5173
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'shared/**/*', dest: 'shared' },
        { src: 'animation/demos/**/*', dest: 'animation/demos' },
        { src: 'animation/styles.css', dest: 'animation' },
        { src: 'grid/**/*', dest: 'grid' },
        { src: 'svg/**/*', dest: 'svg' },
        { src: 'box-shadow/**/*', dest: 'box-shadow' }
      ]
    })
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        animation: path.resolve(__dirname, 'animation/index.html'),
        grid: path.resolve(__dirname, 'grid/index.html'),
        svg: path.resolve(__dirname, 'svg/index.html'),
        boxshadow: path.resolve(__dirname, 'box-shadow/index.html')
      }
    }
  }
})
