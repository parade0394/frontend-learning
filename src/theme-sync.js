/**
 * 主题同步入口文件
 * 用于 demo 页面（轻量级，只同步主题，不包含 UI）
 */

import { storage } from './utils/storage.js';
import { BackToTop } from './components/BackToTop.js';

// 从 localStorage 读取主题设置
const savedThemeMode = storage.get('themeMode', 'light');
const savedColor = storage.get('primaryColor', '#10b981');

/**
 * 应用主题模式
 */
function applyThemeMode(mode) {
  let actualTheme = mode;

  if (mode === 'auto') {
    actualTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', actualTheme);
}

/**
 * 应用主色调
 */
function applyPrimaryColor(color) {
  const adjustColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    let r = (num >> 16) / 255;
    let g = ((num >> 8) & 0x00ff) / 255;
    let b = (num & 0x0000ff) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    l = Math.max(0, Math.min(1, l + percent / 100));

    const hue2rgb = (p, q, t) => {
      if (t < 0) {t += 1;}
      if (t > 1) {t -= 1;}
      if (t < 1 / 6) {return p + (q - p) * 6 * t;}
      if (t < 1 / 2) {return q;}
      if (t < 2 / 3) {return p + (q - p) * (2 / 3 - t) * 6;}
      return p;
    };

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
  };

  const darkColor = adjustColor(color, -15);
  const lightColor = adjustColor(color, 35);
  const lighterColor = adjustColor(color, 40);

  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-dark', darkColor);
  document.documentElement.style.setProperty('--primary-light', lightColor);
  document.documentElement.style.setProperty('--primary-lighter', lighterColor);
}

// 立即应用主题
applyThemeMode(savedThemeMode);
applyPrimaryColor(savedColor);

// 监听系统主题变化
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentMode = storage.get('themeMode');
    if (currentMode === 'auto') {
      applyThemeMode('auto');
    }
  });
}

// 监听 localStorage 变化（跨标签页同步）
window.addEventListener('storage', (e) => {
  if (e.key === 'themeMode') {
    applyThemeMode(e.newValue || 'light');
  } else if (e.key === 'primaryColor') {
    applyPrimaryColor(e.newValue || '#10b981');
  }
});

// 初始化返回顶部按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
  });
} else {
  new BackToTop();
}
