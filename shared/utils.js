/* ========================================
   公共工具函数 - Utility Functions
   用于所有模块的通用JavaScript功能
   ======================================== */

const reduceMotion = (function() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
})();

/**
 * 播放动画 - 通过添加/移除类名触发CSS动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} className - 动画类名
 * @param {number} duration - 动画持续时间（毫秒）
 */
function playAnimation(element, className, duration = 1500) {
  if (reduceMotion) return;
  // 移除类名，重置动画
  element.classList.remove(className);

  // 强制重排，确保动画重新开始
  void element.offsetHeight;

  // 添加动画类名
  element.classList.add(className);

  // 动画结束后移除类名
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

/**
 * 重置动画 - 移除所有动画类名
 * @param {HTMLElement} element - 目标元素
 * @param {string|string[]} classNames - 要移除的类名（可选）
 */
function resetAnimation(element, classNames = null) {
  if (classNames) {
    const classes = Array.isArray(classNames) ? classNames : [classNames];
    classes.forEach((className) => element.classList.remove(className));
  } else {
    // 移除所有以 'animate-' 开头的类名
    const animateClasses = Array.from(element.classList).filter((c) => c.startsWith('animate-'));
    animateClasses.forEach((className) => element.classList.remove(className));
  }

  // 重置 transform
  element.style.transform = '';
}

/**
 * 播放 Transform 动画 - 直接操作 style.transform
 * 适用于不想定义 CSS 类的场景
 * @param {HTMLElement} element - 目标元素
 * @param {string} transformValue - transform 的值，如 'translate(100px, 50px)'
 * @param {number} duration - 动画持续时间（毫秒）
 */
function playTransform(element, transformValue, duration = 1500) {
  if (reduceMotion) return;
  // 重置 transform
  element.style.transform = 'none';

  // 强制重排，确保动画重新开始
  void element.offsetHeight;

  // 应用 transform
  element.style.transform = transformValue;

  // 动画结束后重置
  setTimeout(() => {
    element.style.transform = 'none';
  }, duration);
}

/**
 * 防抖函数 - 延迟执行，多次调用只执行最后一次
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数 - 限制执行频率
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 格式化代码 - 添加语法高亮
 * @param {string} code - 代码字符串
 * @returns {string} 格式化后的HTML
 */
function formatCode(code) {
  return code
    .replace(/\/\*(.*?)\*\//g, '<span class="comment">/*$1*/</span>')
    .replace(/\/\/(.*?)$/gm, '<span class="comment">//$1</span>')
    .replace(
      /\b(transform|transition|animation|display|position|background|color|width|height|margin|padding)\b/g,
      '<span class="property">$1</span>'
    )
    .replace(/\b(translate|rotate|scale|skew|ease|linear|none|block|flex|grid)\b/g, '<span class="value">$1</span>')
    .replace(/\b(function|const|let|var|return|if|else|for|while)\b/g, '<span class="keyword">$1</span>');
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success|warning|error|info)
 * @param {number} duration - 显示时长（毫秒）
 */
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

/**
 * 获取元素的计算样式
 * @param {HTMLElement} element - 目标元素
 * @param {string} property - CSS属性名
 * @returns {string} 属性值
 */
function getComputedStyle(element, property) {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 检测是否为移动设备
 * @returns {boolean}
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 平滑滚动到指定元素
 * @param {string|HTMLElement} target - 目标元素或选择器
 * @param {number} offset - 偏移量（像素）
 */
function scrollToElement(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top: top,
    behavior: 'smooth',
  });
}

/**
 * 本地存储工具
 */
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('存储失败:', err);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (err) {
      console.error('读取失败:', err);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error('删除失败:', err);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.error('清空失败:', err);
      return false;
    }
  },
};

// 添加动画样式（如果页面中没有）
if (!document.querySelector('#utils-animations')) {
  const style = document.createElement('style');
  style.id = 'utils-animations';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
