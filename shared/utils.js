/* ========================================
   公共工具函数 - Utility Functions
   用于所有模块的通用JavaScript功能
   
   包含功能：
   - 动画控制 (playAnimation, resetAnimation, playTransform)
   - 防抖节流 (debounce, throttle)
   - 代码格式化 (formatCode)
   - 剪贴板操作 (copyToClipboard)
   - 提示消息 (showToast)
   - 本地存储 (storage)
   - 工具函数 (isMobile, scrollToElement, getComputedStyle)
   ======================================== */

/**
 * 检测用户是否启用了减少动画偏好
 * @type {boolean}
 */
const reduceMotion = (function () {
  try {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
})();

/**
 * 播放动画 - 通过添加/移除类名触发CSS动画
 * 自动处理减少动画偏好设置
 *
 * @param {HTMLElement} element - 目标元素
 * @param {string} className - 动画类名
 * @param {number} duration - 动画持续时间（毫秒），默认1500ms
 * @example
 * playAnimation(box, 'bounce', 1000);
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
 *
 * @param {HTMLElement} element - 目标元素
 * @param {string|string[]|null} classNames - 要移除的类名（可选）
 * @example
 * resetAnimation(box); // 移除所有 animate- 开头的类
 * resetAnimation(box, 'bounce'); // 移除指定类
 * resetAnimation(box, ['bounce', 'fade']); // 移除多个类
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
 *
 * @param {HTMLElement} element - 目标元素
 * @param {string} transformValue - transform 的值
 * @param {number} duration - 动画持续时间（毫秒），默认1500ms
 * @example
 * playTransform(box, 'translate(100px, 50px)', 1000);
 * playTransform(box, 'rotate(45deg) scale(1.5)', 2000);
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
 * 常用于搜索输入、窗口resize等高频事件
 *
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒），默认300ms
 * @returns {Function} 防抖后的函数
 * @example
 * const debouncedSearch = debounce((query) => search(query), 500);
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value));
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
 * 常用于滚动事件、鼠标移动等高频事件
 *
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 时间间隔（毫秒），默认300ms
 * @returns {Function} 节流后的函数
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
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
 * 为代码字符串添加HTML标记以实现语法高亮
 *
 * @param {string} code - 代码字符串
 * @returns {string} 格式化后的HTML字符串
 * @example
 * const highlighted = formatCode('transform: rotate(45deg);');
 * codeBlock.innerHTML = highlighted;
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
 * 优先使用现代 Clipboard API，降级到 execCommand
 *
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 * @example
 * const success = await copyToClipboard('Hello World');
 * if (success) showToast('复制成功', 'success');
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
 * 显示提示消息 (Toast)
 * 在页面右上角显示临时提示消息
 *
 * @param {string} message - 消息内容
 * @param {('success'|'warning'|'error'|'info')} type - 消息类型
 * @param {number} duration - 显示时长（毫秒），默认3000ms
 * @example
 * showToast('操作成功', 'success');
 * showToast('请检查输入', 'warning', 5000);
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
 *
 * @param {HTMLElement} element - 目标元素
 * @param {string} property - CSS属性名
 * @returns {string} 属性值
 * @example
 * const color = getComputedStyle(element, 'color');
 */
function getComputedStyle(element, property) {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 检测是否为移动设备
 * 基于 User Agent 字符串判断
 *
 * @returns {boolean} 是否为移动设备
 * @example
 * if (isMobile()) {
 *   // 移动端特殊处理
 * }
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 平滑滚动到指定元素
 *
 * @param {string|HTMLElement} target - 目标元素或选择器
 * @param {number} offset - 偏移量（像素），默认0
 * @example
 * scrollToElement('#section2', 80); // 滚动到元素，留80px顶部间距
 * scrollToElement(document.querySelector('.target'));
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
 * 本地存储工具 - 带完整错误处理
 * 在隐私模式或存储配额满时安全降级
 */
const storage = {
  /**
   * 存储数据
   * @param {string} key - 键名
   * @param {*} value - 值（会自动JSON序列化）
   * @returns {boolean} 是否成功
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`存储失败 (${key}):`, err.message);
      // 可能的错误：QuotaExceededError, SecurityError (隐私模式)
      return false;
    }
  },

  /**
   * 读取数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的值或默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (err) {
      console.warn(`读取失败 (${key}):`, err.message);
      return defaultValue;
    }
  },

  /**
   * 删除数据
   * @param {string} key - 键名
   * @returns {boolean} 是否成功
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`删除失败 (${key}):`, err.message);
      return false;
    }
  },

  /**
   * 清空所有数据
   * @returns {boolean} 是否成功
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.warn('清空失败:', err.message);
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

// 可访问性：为导航激活项设置 aria-current
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item.active').forEach((el) => {
      el.setAttribute('aria-current', 'page');
    });
  });
} else {
  document.querySelectorAll('.nav-item.active').forEach((el) => {
    el.setAttribute('aria-current', 'page');
  });
}

// 返回顶部按钮（防止重复初始化）
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
