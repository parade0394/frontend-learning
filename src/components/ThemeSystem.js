/**
 * 主题系统组件
 * 支持暗色模式和主题颜色定制
 */

import { storage } from '../utils/storage.js';

export class ThemeSystem {
  constructor() {
    this.savedThemeMode = storage.get('themeMode', 'light');
    this.savedColor = storage.get('primaryColor', '#10b981');

    // 立即应用主题（避免闪烁）
    this.applyThemeMode(this.savedThemeMode);
    this.applyPrimaryColor(this.savedColor);

    // 监听系统主题变化
    this.watchSystemTheme();

    // 等待 DOM 加载完成后初始化 UI
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.createThemeUI();
    this.setupEventListeners();
  }

  watchSystemTheme() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentMode = storage.get('themeMode');
        if (currentMode === 'auto') {
          this.applyThemeMode('auto');
        }
      });
    }
  }

  applyThemeMode(mode) {
    let actualTheme = mode;

    if (mode === 'auto') {
      actualTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', actualTheme);

    // 更新图标
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = actualTheme === 'dark' ? '🌙' : '☀️';
    }
  }

  applyPrimaryColor(color) {
    const darkColor = this.adjustColor(color, -15);
    const lightColor = this.adjustColor(color, 35);
    const lighterColor = this.adjustColor(color, 40);

    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-dark', darkColor);
    document.documentElement.style.setProperty('--primary-light', lightColor);
    document.documentElement.style.setProperty('--primary-lighter', lighterColor);
  }

  adjustColor(color, percent) {
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
  }

  createThemeUI() {
    if (document.getElementById('themeToolbar')) {return;}

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
    const themeModePanel = this.createThemeModePanel();

    // 创建主题颜色面板
    const colorPanel = this.createColorPanel();

    // 添加到页面
    document.body.appendChild(toolbar);
    document.body.appendChild(themeModePanel);
    document.body.appendChild(colorPanel);
  }

  createThemeModePanel() {
    const panel = document.createElement('div');
    panel.id = 'themeModePanel';
    panel.className = 'theme-panel';
    panel.innerHTML = `
      <h3>🌙 暗色模式</h3>
      <div class="theme-mode-options">
        <label class="theme-mode-option">
          <input type="radio" name="themeMode" value="light" ${this.savedThemeMode === 'light' ? 'checked' : ''}>
          <span>☀️ 亮色</span>
        </label>
        <label class="theme-mode-option">
          <input type="radio" name="themeMode" value="dark" ${this.savedThemeMode === 'dark' ? 'checked' : ''}>
          <span>🌙 暗色</span>
        </label>
        <label class="theme-mode-option">
          <input type="radio" name="themeMode" value="auto" ${this.savedThemeMode === 'auto' ? 'checked' : ''}>
          <span>🖥️ 跟随系统</span>
        </label>
      </div>
    `;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-label', '暗色模式设置');
    return panel;
  }

  createColorPanel() {
    const panel = document.createElement('div');
    panel.id = 'colorPanel';
    panel.className = 'theme-panel';

    const colors = [
      { value: '#10b981', name: '翡翠绿', desc: '默认主题' },
      { value: '#3b82f6', name: '天空蓝', desc: '清新明亮' },
      { value: '#8b5cf6', name: '紫罗兰', desc: '优雅神秘' },
      { value: '#f59e0b', name: '琥珀橙', desc: '温暖活力' },
      { value: '#ec4899', name: '玫瑰粉', desc: '浪漫柔和' },
    ];

    const optionsHTML = colors
      .map(
        (color) => `
      <div class="theme-option ${this.savedColor === color.value ? 'active' : ''}" data-color="${color.value}">
        <div class="color-preview" style="background: linear-gradient(135deg, ${color.value} 0%, ${this.adjustColor(color.value, -10)} 100%);"></div>
        <div class="theme-option-text">
          <div class="theme-option-name">${color.name}</div>
          <div class="theme-option-desc">${color.desc}</div>
        </div>
      </div>
    `
      )
      .join('');

    panel.innerHTML = `
      <h3>🎨 主题颜色</h3>
      <div class="theme-options">
        ${optionsHTML}
      </div>
    `;

    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-label', '主题颜色设置');
    return panel;
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    const customizeBtn = document.getElementById('customizeBtn');
    const themeModePanel = document.getElementById('themeModePanel');
    const colorPanel = document.getElementById('colorPanel');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeModeInputs = document.querySelectorAll('input[name="themeMode"]');

    // 暗色模式按钮
    themeToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePanel(themeModePanel, themeToggle, colorPanel, customizeBtn);
    });

    // 主题定制按钮
    customizeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePanel(colorPanel, customizeBtn, themeModePanel, themeToggle);
    });

    // 暗色模式选择
    themeModeInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        const mode = e.target.value;
        this.applyThemeMode(mode);
        storage.set('themeMode', mode);
      });
    });

    // 主题颜色选择
    themeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const color = option.getAttribute('data-color');
        themeOptions.forEach((opt) => opt.classList.remove('active'));
        option.classList.add('active');
        this.applyPrimaryColor(color);
        storage.set('primaryColor', color);
      });
    });

    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
      const isClickInsidePanel =
        themeModePanel?.contains(e.target) || colorPanel?.contains(e.target);
      const isClickOnButton = themeToggle?.contains(e.target) || customizeBtn?.contains(e.target);

      if (!isClickInsidePanel && !isClickOnButton) {
        this.closeAllPanels();
      }
    });

    // Esc 关闭面板
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllPanels();
      }
    });
  }

  togglePanel(panelToOpen, btnToOpen, panelToClose, btnToClose) {
    panelToOpen.classList.toggle('active');
    panelToOpen.setAttribute(
      'aria-hidden',
      panelToOpen.classList.contains('active') ? 'false' : 'true'
    );
    btnToOpen.setAttribute(
      'aria-expanded',
      panelToOpen.classList.contains('active') ? 'true' : 'false'
    );

    panelToClose?.classList.remove('active');
    panelToClose?.setAttribute('aria-hidden', 'true');
    btnToClose?.setAttribute('aria-expanded', 'false');
  }

  closeAllPanels() {
    const themeModePanel = document.getElementById('themeModePanel');
    const colorPanel = document.getElementById('colorPanel');
    const themeToggle = document.getElementById('themeToggle');
    const customizeBtn = document.getElementById('customizeBtn');

    themeModePanel?.classList.remove('active');
    themeModePanel?.setAttribute('aria-hidden', 'true');
    themeToggle?.setAttribute('aria-expanded', 'false');

    colorPanel?.classList.remove('active');
    colorPanel?.setAttribute('aria-hidden', 'true');
    customizeBtn?.setAttribute('aria-expanded', 'false');
  }
}
