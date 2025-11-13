/**
 * Vite 配置文件
 * 多页面应用构建配置
 *
 * 功能：
 * - 多入口页面配置
 * - CSS 代码分割和压缩
 * - 静态资源复制（JS/CSS）
 * - 开发服务器配置
 *
 * 注意：本项目使用传统的 IIFE JS 文件，不是 ES 模块
 * 因此 JS 文件作为静态资源复制，不经过 Vite 打包
 */

import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',

  // 公共目录（静态资源）
  publicDir: false, // 禁用默认 public 目录

  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
    host: true,
  },

  // 预览服务器配置
  preview: {
    port: 5173,
    open: true,
  },

  // 构建配置
  build: {
    emptyOutDir: true,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console（JS 不经过打包）
        drop_debugger: true,
      },
    },

    rollupOptions: {
      input: {
        // HTML 入口
        ...Object.fromEntries(
          glob
            .sync('**/*.html', {
              ignore: ['node_modules/**', 'dist/**', '.templates/**', '.examples/**', '.guides/**'],
            })
            .map((file) => [file.replace(/\.html$/, '').replace(/\//g, '-'), path.resolve(__dirname, file)])
        ),
        // JS 模块入口
        theme: path.resolve(__dirname, 'src/theme.js'),
        'theme-sync': path.resolve(__dirname, 'src/theme-sync.js'),
        utils: path.resolve(__dirname, 'src/utils.js'),
      },

      output: {
        format: 'es', // 使用 ES Module 格式
        assetFileNames: (assetInfo) => {
          // 确保 assetInfo 和 fileName 存在
          if (!assetInfo || !assetInfo.fileName) {
            return 'assets/[name]-[hash][extname]';
          }

          const info = assetInfo.fileName.split('.');
          const ext = info[info.length - 1];

          if (/css/i.test(ext)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },

  css: {
    devSourcemap: true,
  },

  optimizeDeps: {
    include: [],
  },

  // 插件配置
  plugins: [],
});
