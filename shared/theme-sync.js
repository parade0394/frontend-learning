/**
 * 主题同步脚本 v2.0 - 用于demo页面
 * 轻量级主题同步，从localStorage读取并应用主题设置
 * 不包含UI组件，仅同步主题状态
 *
 * @module theme-sync
 */

(function () {
  'use strict';

  /**
   * 安全读取 localStorage
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的值或默认值
   */
  function safeStorageGet(key, defaultValue) {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (err) {
      console.warn(`localStorage 读取失败 (${key}):`, err.message);
      return defaultValue;
    }
  }

  // 从 localStorage 安全读取主题设置
  const savedThemeMode = safeStorageGet('themeMode', 'light');
  const savedColor = safeStorageGet('primaryColor', '#10b981');

  /**
   * 应用主题模式
   * @param {string} mode - 主题模式: 'light' | 'dark' | 'auto'
   */
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

  /**
   * 应用主色调
   * @param {string} color - 十六进制颜色值
   */
  function applyPrimaryColor(color) {
    const darkColor = adjustColor(color, -15);
    const lightColor = adjustColor(color, 35);
    const lighterColor = adjustColor(color, 40);

    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-dark', darkColor);
    document.documentElement.style.setProperty('--primary-light', lightColor);
    document.documentElement.style.setProperty('--primary-lighter', lighterColor);
  }

  /**
   * 颜色调整函数 - 使用HSL色彩空间
   * @param {string} color - 十六进制颜色值
   * @param {number} percent - 亮度调整百分比
   * @returns {string} 调整后的颜色
   */
  function adjustColor(color, percent) {
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

    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

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

// 返回顶部按钮
(function initBackToTop() {
  'use strict';

  function init() {
    // 检查是否已经存在按钮，避免重复创建
    if (document.querySelector('.back-to-top')) {
      return;
    }

    // 创建按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', '返回顶部');
    backToTopBtn.setAttribute('title', '返回顶部');

    // 添加到页面
    document.body.appendChild(backToTopBtn);

    // 检测实际的滚动容器（可能是 window 或 .main-content）
    const scrollContainer = document.querySelector('.main-content') || window;
    const isWindow = scrollContainer === window;

    // 显示/隐藏按钮的核心逻辑
    function checkScroll() {
      const scrollTop = isWindow
        ? window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        : scrollContainer.scrollTop;

      if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // 节流函数（内部定义）
    let lastTime = 0;
    function throttledCheck() {
      const now = Date.now();
      if (now - lastTime >= 100) {
        lastTime = now;
        checkScroll();
      }
    }

    scrollContainer.addEventListener('scroll', throttledCheck, { passive: true });

    // 点击事件 - 平滑滚动到顶部
    backToTopBtn.addEventListener('click', () => {
      if (isWindow) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        scrollContainer.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });

    // 初始检查
    checkScroll();
  }

  // 确保 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
