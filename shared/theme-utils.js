/**
 * 主题工具函数库
 * 提供主题系统共享的工具函数，避免代码重复
 * @module theme-utils
 */

/**
 * 颜色调整函数 - 使用HSL色彩空间进行更自然的调整
 * @param {string} color - 十六进制颜色值 (如 '#10b981')
 * @param {number} percent - 亮度调整百分比 (正值变亮，负值变暗)
 * @returns {string} 调整后的十六进制颜色值
 * @example
 * adjustColor('#10b981', 20) // 返回更亮的颜色
 * adjustColor('#10b981', -20) // 返回更暗的颜色
 */
export function adjustColor(color, percent) {
  // 将hex转换为RGB (0-1范围)
  const num = parseInt(color.replace('#', ''), 16);
  let r = (num >> 16) / 255;
  let g = ((num >> 8) & 0x00ff) / 255;
  let b = (num & 0x0000ff) / 255;

  // 转换为HSL色彩空间
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // 灰色
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
    r = g = b = l; // 灰色
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

/**
 * 应用主色调到CSS变量
 * @param {string} color - 主色调的十六进制颜色值
 */
export function applyPrimaryColor(color) {
  const darkColor = adjustColor(color, -15);
  const lightColor = adjustColor(color, 35);
  const lighterColor = adjustColor(color, 40);

  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-dark', darkColor);
  document.documentElement.style.setProperty('--primary-light', lightColor);
  document.documentElement.style.setProperty('--primary-lighter', lighterColor);
}

/**
 * 应用主题模式 (亮色/暗色/自动)
 * @param {string} mode - 主题模式: 'light' | 'dark' | 'auto'
 */
export function applyThemeMode(mode) {
  let actualTheme = mode;

  if (mode === 'auto') {
    // 跟随系统主题
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      actualTheme = 'dark';
    } else {
      actualTheme = 'light';
    }
  }

  document.documentElement.setAttribute('data-theme', actualTheme);
  return actualTheme;
}

/**
 * 安全的 localStorage 操作 - 带错误处理
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的值 (可选，不传则为读取操作)
 * @returns {*} 读取操作返回值，写入操作返回是否成功
 */
export function safeStorage(key, value) {
  try {
    if (value === undefined) {
      // 读取操作
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      // 写入操作
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
  } catch (err) {
    console.warn(`localStorage 操作失败 (${key}):`, err.message);
    return value === undefined ? null : false;
  }
}
