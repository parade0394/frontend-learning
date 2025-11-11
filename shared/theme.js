/**
 * 全站主题系统 v2.0
 * 支持暗色模式（亮色/暗色/跟随系统）和主题颜色定制
 */

(function () {
  'use strict';

  // 从 localStorage 读取主题设置
  const savedThemeMode = localStorage.getItem('themeMode') || 'light'; // light, dark, auto
  const savedColor = localStorage.getItem('primaryColor') || '#10b981';

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
   * 应用主题模式
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
   */
  function createThemeUI() {
    // 检查是否已存在（避免重复创建）
    if (document.getElementById('themeToolbar')) return;

    const currentTheme = document.documentElement.getAttribute('data-theme');

    // 创建工具栏
    const toolbar = document.createElement('div');
    toolbar.id = 'themeToolbar';
    toolbar.className = 'theme-toolbar';
    toolbar.innerHTML = `
      <button class="theme-toolbar-btn" id="themeToggle" title="暗色模式">
        <span id="themeIcon">${currentTheme === 'dark' ? '🌙' : '☀️'}</span>
      </button>
      <button class="theme-toolbar-btn" id="customizeBtn" title="主题定制">
        🎨
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

    // 添加样式（如果还没有）
    if (!document.getElementById('themeStyles')) {
      addThemeStyles();
    }
  }

  /**
   * 添加主题样式
   */
  function addThemeStyles() {
    const style = document.createElement('style');
    style.id = 'themeStyles';
    style.textContent = `
      /* 主题变量 */
      :root[data-theme="light"] {
        --bg-primary: #ffffff;
        --bg-secondary: #f9fafb;
        --text-primary: #111827;
        --text-secondary: #6b7280;
        --border-color: #e5e7eb;
        --card-bg: #ffffff;
        --card-hover-shadow: rgba(0, 0, 0, 0.1);
      }

      :root[data-theme="dark"] {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --border-color: #404040;
        --card-bg: #2d2d2d;
        --card-hover-shadow: rgba(255, 255, 255, 0.1);
      }

      body {
        background: var(--bg-secondary);
        color: var(--text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* 工具栏 */
      .theme-toolbar {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 10000;
      }

      .theme-toolbar-btn {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .theme-toolbar-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-color: var(--primary);
      }

      /* 主题面板 */
      .theme-panel {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 300px;
        max-height: 80vh;
        overflow-y: auto;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: none;
        z-index: 9999;
      }

      .theme-panel.active {
        display: block;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .theme-panel h3 {
        font-size: 1.1rem;
        margin-bottom: 15px;
        color: var(--text-primary);
      }

      /* 暗色模式选项 */
      .theme-mode-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .theme-mode-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid var(--border-color);
      }

      .theme-mode-option:hover {
        background: var(--bg-secondary);
        border-color: var(--primary);
      }

      .theme-mode-option:has(input:checked) {
        background: var(--primary-light);
        border-color: var(--primary);
      }

      .theme-mode-option:has(input:checked) span {
        color: var(--primary);
        font-weight: 600;
      }

      .theme-mode-option input[type="radio"] {
        cursor: pointer;
      }

      .theme-mode-option span {
        font-size: 0.9rem;
        color: var(--text-primary);
        font-weight: 500;
      }

      /* 主题颜色选项 */
      .theme-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s ease;
        margin-bottom: 8px;
        border: 2px solid transparent;
      }

      .theme-option:hover {
        background: var(--bg-secondary);
      }

      .theme-option.active {
        background: var(--primary-light);
        border-color: var(--primary);
      }

      .theme-option.active .theme-option-name,
      .theme-option.active .theme-option-desc {
        color: var(--primary);
      }

      .color-preview {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 2px solid var(--border-color);
        flex-shrink: 0;
      }

      .theme-option-text {
        flex: 1;
      }

      .theme-option-name {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
      }

      .theme-option-desc {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }

      /* 响应式 */
      @media (max-width: 768px) {
        .theme-toolbar {
          top: 10px;
          right: 10px;
        }

        .theme-toolbar-btn {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }

        .theme-panel {
          right: 10px;
          left: 10px;
          width: auto;
        }
      }
    `;
    document.head.appendChild(style);
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
          // 关闭颜色面板
          if (colorPanel) {
            colorPanel.classList.remove('active');
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
          // 关闭暗色模式面板
          if (themeModePanel) {
            themeModePanel.classList.remove('active');
          }
        }
      });
    }

    // 暗色模式选择
    themeModeInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        const mode = e.target.value;
        applyThemeMode(mode);
        localStorage.setItem('themeMode', mode);
      });
    });

    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
      const isClickInsidePanel = (themeModePanel && themeModePanel.contains(e.target)) || (colorPanel && colorPanel.contains(e.target));
      const isClickOnButton = (themeToggle && themeToggle.contains(e.target)) || (customizeBtn && customizeBtn.contains(e.target));

      if (!isClickInsidePanel && !isClickOnButton) {
        if (themeModePanel) themeModePanel.classList.remove('active');
        if (colorPanel) colorPanel.classList.remove('active');
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
        localStorage.setItem('primaryColor', color);
      });
    });
  }

  /**
   * 应用主色调
   */
  function applyPrimaryColor(color) {
    const darkColor = adjustColor(color, -15); // 稍微变暗
    const lightColor = adjustColor(color, 35); // 明显变亮但不至于接近白色
    const lighterColor = adjustColor(color, 40); // 更亮一些

    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-dark', darkColor);
    document.documentElement.style.setProperty('--primary-light', lightColor);
    document.documentElement.style.setProperty('--primary-lighter', lighterColor);
  }

  /**
   * 颜色调整函数 - 使用HSL色彩空间进行更自然的调整
   */
  function adjustColor(color, percent) {
    // 将hex转换为RGB
    const num = parseInt(color.replace('#', ''), 16);
    let r = (num >> 16) / 255;
    let g = ((num >> 8) & 0x00ff) / 255;
    let b = (num & 0x0000ff) / 255;

    // 转换为HSL
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

    // 调整亮度
    l = Math.max(0, Math.min(1, l + percent / 100));

    // 转换回RGB
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

    // 转换为hex
    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
  }
})();
