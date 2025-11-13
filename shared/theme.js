/**
 * 全站主题系统 v2.1
 * 支持暗色模式（亮色/暗色/跟随系统）和主题颜色定制
 *
 * 功能：
 * - 主题模式切换 (亮色/暗色/跟随系统)
 * - 主题颜色定制 (5种预设颜色)
 * - 设置持久化 (localStorage)
 * - 系统主题监听
 * - 完整的键盘导航和可访问性支持
 *
 * @module theme
 */

(function () {
  'use strict';

  // 从 localStorage 安全读取主题设置
  const savedThemeMode = safeStorageGet('themeMode', 'light');
  const savedColor = safeStorageGet('primaryColor', '#10b981');

  // 立即应用主题（避免闪烁）
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

  // 等待 DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    createThemeUI();
    setupEventListeners();
  }

  /**
   * 安全的 localStorage 读取
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的值或默认值
   */
  function safeStorageGet(key, defaultValue) {
    try {
      const value = localStorage.getItem(key);
      return value || defaultValue;
    } catch (err) {
      console.warn(`localStorage 读取失败 (${key}):`, err.message);
      return defaultValue;
    }
  }

  /**
   * 安全的 localStorage 写入
   * @param {string} key - 键名
   * @param {*} value - 值
   * @returns {boolean} 是否成功
   */
  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.warn(`localStorage 写入失败 (${key}):`, err.message);
      return false;
    }
  }

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

    // 更新图标
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = actualTheme === 'dark' ? '🌙' : '☀️';
    }
  }

  /**
   * 创建主题 UI（工具栏和面板）
   * 动态生成主题切换工具栏和设置面板
   */
  function createThemeUI() {
    // 检查是否已存在（避免重复创建）
    if (document.getElementById('themeToolbar')) return;

    const currentTheme = document.documentElement.getAttribute('data-theme');

    // 创建工具栏
    const toolbar = document.createElement('div');
    toolbar.id = 'themeToolbar';
    toolbar.className = 'theme-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', '主题设置工具栏');
    toolbar.innerHTML = `
      <button class="theme-toolbar-btn" id="themeToggle" 
              title="暗色模式" 
              aria-label="切换暗色模式"
              aria-controls="themeModePanel"
              aria-expanded="false">
        <span id="themeIcon" aria-hidden="true">${currentTheme === 'dark' ? '🌙' : '☀️'}</span>
      </button>
      <button class="theme-toolbar-btn" id="customizeBtn" 
              title="主题定制" 
              aria-label="定制主题颜色"
              aria-controls="colorPanel"
              aria-expanded="false">
        <span aria-hidden="true">🎨</span>
      </button>
    `;

    // 创建暗色模式面板
    const themeModePanel = document.createElement('div');
    themeModePanel.id = 'themeModePanel';
    themeModePanel.className = 'theme-panel';
    themeModePanel.innerHTML = `
      <h3>🌙 暗色模式</h3>
      <div class="theme-mode-options">
        <label class="theme-mode-option">
          <input type="radio" name="themeMode" value="light" ${savedThemeMode === 'light' ? 'checked' : ''}>
          <span>☀️ 亮色</span>
        </label>
        <label class="theme-mode-option">
          <input type="radio" name="themeMode" value="dark" ${savedThemeMode === 'dark' ? 'checked' : ''}>
          <span>🌙 暗色</span>
        </label>
        <label class="theme-mode-option">
          <input type="radio" name="themeMode" value="auto" ${savedThemeMode === 'auto' ? 'checked' : ''}>
          <span>🖥️ 跟随系统</span>
        </label>
      </div>
    `;

    // 创建主题颜色面板
    const colorPanel = document.createElement('div');
    colorPanel.id = 'colorPanel';
    colorPanel.className = 'theme-panel';
    colorPanel.innerHTML = `
      <h3>🎨 主题颜色</h3>
      <div class="theme-options">
        <div class="theme-option ${savedColor === '#10b981' ? 'active' : ''}" data-color="#10b981">
          <div class="color-preview" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"></div>
          <div class="theme-option-text">
            <div class="theme-option-name">翡翠绿</div>
            <div class="theme-option-desc">默认主题</div>
          </div>
        </div>
        <div class="theme-option ${savedColor === '#3b82f6' ? 'active' : ''}" data-color="#3b82f6">
          <div class="color-preview" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);"></div>
          <div class="theme-option-text">
            <div class="theme-option-name">天空蓝</div>
            <div class="theme-option-desc">清新明亮</div>
          </div>
        </div>
        <div class="theme-option ${savedColor === '#8b5cf6' ? 'active' : ''}" data-color="#8b5cf6">
          <div class="color-preview" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);"></div>
          <div class="theme-option-text">
            <div class="theme-option-name">紫罗兰</div>
            <div class="theme-option-desc">优雅神秘</div>
          </div>
        </div>
        <div class="theme-option ${savedColor === '#f59e0b' ? 'active' : ''}" data-color="#f59e0b">
          <div class="color-preview" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);"></div>
          <div class="theme-option-text">
            <div class="theme-option-name">琥珀橙</div>
            <div class="theme-option-desc">温暖活力</div>
          </div>
        </div>
        <div class="theme-option ${savedColor === '#ec4899' ? 'active' : ''}" data-color="#ec4899">
          <div class="color-preview" style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);"></div>
          <div class="theme-option-text">
            <div class="theme-option-name">玫瑰粉</div>
            <div class="theme-option-desc">浪漫柔和</div>
          </div>
        </div>
      </div>
    `;

    // 添加到页面
    document.body.appendChild(toolbar);
    document.body.appendChild(themeModePanel);
    document.body.appendChild(colorPanel);

    // ARIA 属性
    themeModePanel.setAttribute('role', 'dialog');
    themeModePanel.setAttribute('aria-modal', 'false');
    themeModePanel.setAttribute('aria-hidden', 'true');
    themeModePanel.setAttribute('aria-label', '暗色模式设置');

    colorPanel.setAttribute('role', 'dialog');
    colorPanel.setAttribute('aria-modal', 'false');
    colorPanel.setAttribute('aria-hidden', 'true');
    colorPanel.setAttribute('aria-label', '主题颜色设置');
  }

  /**
   * 设置事件监听
   */
  function setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    const customizeBtn = document.getElementById('customizeBtn');
    const themeModePanel = document.getElementById('themeModePanel');
    const colorPanel = document.getElementById('colorPanel');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeModeInputs = document.querySelectorAll('input[name="themeMode"]');

    // 点击暗色模式按钮
    if (themeToggle) {
      themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (themeModePanel) {
          themeModePanel.classList.toggle('active');
          themeModePanel.setAttribute('aria-hidden', themeModePanel.classList.contains('active') ? 'false' : 'true');
          themeToggle.setAttribute('aria-expanded', themeModePanel.classList.contains('active') ? 'true' : 'false');
          // 关闭颜色面板
          if (colorPanel) {
            colorPanel.classList.remove('active');
            colorPanel.setAttribute('aria-hidden', 'true');
            if (customizeBtn) customizeBtn.setAttribute('aria-expanded', 'false');
          }
          // 焦点管理
          if (themeModePanel.classList.contains('active')) {
            const firstRadio = themeModePanel.querySelector('input[name="themeMode"]');
            if (firstRadio) firstRadio.focus();
          }
        }
      });
    }

    // 点击主题定制按钮
    if (customizeBtn) {
      customizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (colorPanel) {
          colorPanel.classList.toggle('active');
          colorPanel.setAttribute('aria-hidden', colorPanel.classList.contains('active') ? 'false' : 'true');
          customizeBtn.setAttribute('aria-expanded', colorPanel.classList.contains('active') ? 'true' : 'false');
          // 关闭暗色模式面板
          if (themeModePanel) {
            themeModePanel.classList.remove('active');
            themeModePanel.setAttribute('aria-hidden', 'true');
            if (themeToggle) themeToggle.setAttribute('aria-expanded', 'false');
          }
          // 焦点管理
          if (colorPanel.classList.contains('active')) {
            const firstOption = colorPanel.querySelector('.theme-option');
            if (firstOption) firstOption.focus();
          }
        }
      });
    }

    // 暗色模式选择
    themeModeInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        const mode = e.target.value;
        applyThemeMode(mode);
        safeStorageSet('themeMode', mode);
      });
    });

    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
      const isClickInsidePanel = (themeModePanel && themeModePanel.contains(e.target)) || (colorPanel && colorPanel.contains(e.target));
      const isClickOnButton = (themeToggle && themeToggle.contains(e.target)) || (customizeBtn && customizeBtn.contains(e.target));

      if (!isClickInsidePanel && !isClickOnButton) {
        if (themeModePanel) {
          themeModePanel.classList.remove('active');
          themeModePanel.setAttribute('aria-hidden', 'true');
          if (themeToggle) themeToggle.setAttribute('aria-expanded', 'false');
        }
        if (colorPanel) {
          colorPanel.classList.remove('active');
          colorPanel.setAttribute('aria-hidden', 'true');
          if (customizeBtn) customizeBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Esc 关闭面板
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (themeModePanel) {
          themeModePanel.classList.remove('active');
          themeModePanel.setAttribute('aria-hidden', 'true');
          if (themeToggle) themeToggle.setAttribute('aria-expanded', 'false');
        }
        if (colorPanel) {
          colorPanel.classList.remove('active');
          colorPanel.setAttribute('aria-hidden', 'true');
          if (customizeBtn) customizeBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      const activePanel =
        themeModePanel && themeModePanel.classList.contains('active')
          ? themeModePanel
          : colorPanel && colorPanel.classList.contains('active')
          ? colorPanel
          : null;
      if (!activePanel) return;
      if (e.key !== 'Tab') return;
      const focusables = Array.from(activePanel.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const isShift = e.shiftKey;
      const current = document.activeElement;
      if (isShift && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!isShift && current === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // 主题颜色选择
    themeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const color = option.getAttribute('data-color');

        // 更新选中状态
        themeOptions.forEach((opt) => opt.classList.remove('active'));
        option.classList.add('active');

        // 应用颜色
        applyPrimaryColor(color);
        safeStorageSet('primaryColor', color);
      });
    });
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
})();
