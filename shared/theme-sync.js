/**
 * 主题同步脚本 - 用于demo页面
 * 从localStorage读取主题设置并应用，无需完整的theme.js
 */

(function () {
  'use strict';

  // 从 localStorage 读取主题设置
  const savedThemeMode = localStorage.getItem('themeMode') || 'light';
  const savedColor = localStorage.getItem('primaryColor') || '#10b981';

  // 应用主题模式
  function applyThemeMode(mode) {
    let actualTheme = mode;

    if (mode === 'auto') {
      // 跟随系统
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        actualTheme = 'dark';
      } else {
        actualTheme = 'light';
      }
    }

    document.documentElement.setAttribute('data-theme', actualTheme);
  }

  // 应用主色调
  function applyPrimaryColor(color) {
    const darkColor = adjustColor(color, -20);
    const lightColor = adjustColor(color, 90);
    const lighterColor = adjustColor(color, 95);

    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-dark', darkColor);
    document.documentElement.style.setProperty('--primary-light', lightColor);
    document.documentElement.style.setProperty('--primary-lighter', lighterColor);
  }

  // 颜色调整函数
  function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255))
        .toString(16)
        .slice(1)
    );
  }

  // 立即应用主题
  applyThemeMode(savedThemeMode);
  applyPrimaryColor(savedColor);

  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const currentMode = localStorage.getItem('themeMode');
      if (currentMode === 'auto') {
        applyThemeMode('auto');
      }
    });
  }

  // 监听localStorage变化（当其他标签页改变主题时同步）
  window.addEventListener('storage', (e) => {
    if (e.key === 'themeMode') {
      applyThemeMode(e.newValue || 'light');
    } else if (e.key === 'primaryColor') {
      applyPrimaryColor(e.newValue || '#10b981');
    }
  });
})();
