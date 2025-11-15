/**
 * CSS 现代选择器模块 - 无障碍访问和性能优化增强脚本
 * Accessibility and Performance Enhancements
 */

(function () {
  'use strict';

  // ========================================
  // 键盘导航支持
  // ========================================

  /**
   * 为所有交互元素添加键盘导航支持
   */
  function enhanceKeyboardNavigation() {
    // 确保所有可交互元素都可以通过键盘访问
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [tabindex]'
    );

    interactiveElements.forEach((element) => {
      // 如果元素没有 tabindex，添加 tabindex="0"
      if (
        !element.hasAttribute('tabindex') &&
        element.tagName !== 'A' &&
        element.tagName !== 'BUTTON'
      ) {
        element.setAttribute('tabindex', '0');
      }

      // 为没有 aria-label 的按钮添加提示
      if (
        (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') &&
        !element.hasAttribute('aria-label') &&
        !element.textContent.trim()
      ) {
        console.warn('Button without accessible label:', element);
      }
    });
  }

  /**
   * 添加 Enter 和 Space 键支持到自定义按钮
   */
  function addKeyboardButtonSupport() {
    document.addEventListener('keydown', function (e) {
      const target = e.target;

      // 如果是自定义按钮（role="button"）
      if (target.getAttribute('role') === 'button') {
        // Enter 或 Space 键触发点击
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          target.click();
        }
      }
    });
  }

  // ========================================
  // 事件委托优化
  // ========================================

  /**
   * 使用事件委托优化交互式示例
   * 避免为每个元素单独绑定事件监听器
   */
  function setupEventDelegation() {
    // 为整个文档设置事件委托
    document.addEventListener(
      'click',
      function (e) {
        const target = e.target;

        // 处理示例按钮点击
        if (target.matches('.example-btn')) {
          handleExampleButtonClick(target);
        }

        // 处理演示卡片点击
        if (target.matches('.demo-card') || target.closest('.demo-card')) {
          handleDemoCardClick(target.closest('.demo-card') || target);
        }

        // 处理代码复制按钮
        if (target.matches('.copy-code-btn')) {
          handleCopyCode(target);
        }
      },
      false
    );

    // 为输入框添加事件委托
    document.addEventListener(
      'input',
      function (e) {
        const target = e.target;

        // 处理选择器输入框
        if (target.matches('#selector-input')) {
          handleSelectorInput(target);
        }
      },
      false
    );

    // 为焦点事件添加委托
    document.addEventListener(
      'focusin',
      function (e) {
        const target = e.target;

        // 为获得焦点的元素添加视觉提示
        if (target.matches('input, select, textarea')) {
          announceToScreenReader(
            `${target.getAttribute('aria-label') || target.name || '输入框'} 获得焦点`
          );
        }
      },
      false
    );
  }

  /**
   * 处理示例按钮点击
   */
  function handleExampleButtonClick(button) {
    const selector = button.getAttribute('data-selector');
    if (selector) {
      const input = document.getElementById('selector-input');
      if (input) {
        input.value = selector;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        announceToScreenReader(`已选择示例选择器: ${selector}`);
      }
    }
  }

  /**
   * 处理演示卡片点击
   */
  function handleDemoCardClick(card) {
    // 添加点击反馈
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 100);
  }

  /**
   * 处理代码复制
   */
  function handleCopyCode(button) {
    const codeBlock = button.closest('.demo-code')?.querySelector('code');
    if (codeBlock) {
      const text = codeBlock.textContent;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          announceToScreenReader('代码已复制到剪贴板');
          button.textContent = '✓ 已复制';
          setTimeout(() => {
            button.textContent = '复制代码';
          }, 2000);
        })
        .catch((err) => {
          console.error('复制失败:', err);
          announceToScreenReader('复制失败，请手动复制');
        });
    }
  }

  /**
   * 处理选择器输入
   */
  function handleSelectorInput(_input) {
    // 这个函数会被页面特定的脚本覆盖
    // 这里只是确保有基础的处理
  }

  // ========================================
  // ARIA 实时区域支持
  // ========================================

  /**
   * 创建 ARIA 实时区域用于屏幕阅读器通知
   */
  function createAriaLiveRegion() {
    // 检查是否已存在
    if (document.getElementById('aria-live-region')) {
      return;
    }

    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';

    document.body.appendChild(liveRegion);
  }

  /**
   * 向屏幕阅读器宣布消息
   */
  function announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) {
      createAriaLiveRegion();
      // 递归调用
      setTimeout(() => announceToScreenReader(message, priority), 100);
      return;
    }

    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;

    // 清除消息，准备下次使用
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }

  // 将函数暴露到全局，供其他脚本使用
  window.announceToScreenReader = announceToScreenReader;

  // ========================================
  // 焦点管理
  // ========================================

  /**
   * 焦点陷阱 - 用于模态框等场景
   */
  function createFocusTrap(container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') {
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  /**
   * 为侧边栏导航添加焦点管理
   */
  function enhanceSidebarNavigation() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) {
      return;
    }

    const navItems = sidebar.querySelectorAll('.nav-item');

    navItems.forEach((item, index) => {
      // 添加键盘导航
      item.addEventListener('keydown', function (e) {
        let targetIndex;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            targetIndex = (index + 1) % navItems.length;
            navItems[targetIndex].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            targetIndex = (index - 1 + navItems.length) % navItems.length;
            navItems[targetIndex].focus();
            break;
          case 'Home':
            e.preventDefault();
            navItems[0].focus();
            break;
          case 'End':
            e.preventDefault();
            navItems[navItems.length - 1].focus();
            break;
        }
      });
    });
  }

  // ========================================
  // 性能优化
  // ========================================

  /**
   * 为长列表添加 Intersection Observer
   * 实现懒加载和性能优化
   */
  function setupIntersectionObserver() {
    // 检查浏览器支持
    if (!('IntersectionObserver' in window)) {
      console.log('IntersectionObserver not supported');
      return;
    }

    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 元素进入视口
          entry.target.classList.add('is-visible');

          // 如果有懒加载图片
          const lazyImages = entry.target.querySelectorAll('img[data-src]');
          lazyImages.forEach((img) => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          });
        }
      });
    }, options);

    // 观察所有演示区域
    const demoSections = document.querySelectorAll('.demo-section, .demo-container');
    demoSections.forEach((section) => {
      observer.observe(section);
    });
  }

  /**
   * 防抖函数 - 优化频繁触发的事件
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * 节流函数 - 限制函数执行频率
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // 将工具函数暴露到全局
  window.debounce = debounce;
  window.throttle = throttle;

  // ========================================
  // 响应式测试辅助
  // ========================================

  /**
   * 添加响应式断点指示器（仅开发模式）
   */
  function addResponsiveIndicator() {
    // 仅在开发模式下显示
    if (
      window.location.hostname !== 'localhost' &&
      !window.location.hostname.includes('127.0.0.1')
    ) {
      return;
    }

    const indicator = document.createElement('div');
    indicator.id = 'responsive-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      z-index: 10000;
      pointer-events: none;
    `;

    function updateIndicator() {
      const width = window.innerWidth;
      let breakpoint = 'Desktop';

      if (width <= 480) {
        breakpoint = 'Mobile (≤480px)';
      } else if (width <= 768) {
        breakpoint = 'Tablet (≤768px)';
      } else if (width <= 1024) {
        breakpoint = 'Laptop (≤1024px)';
      }

      indicator.textContent = `${breakpoint} - ${width}px`;
    }

    document.body.appendChild(indicator);
    updateIndicator();

    window.addEventListener('resize', debounce(updateIndicator, 250));
  }

  // ========================================
  // 初始化
  // ========================================

  /**
   * 页面加载完成后初始化所有增强功能
   */
  function init() {
    console.log('🚀 初始化无障碍访问和性能优化增强...');

    // 创建 ARIA 实时区域
    createAriaLiveRegion();

    // 增强键盘导航
    enhanceKeyboardNavigation();
    addKeyboardButtonSupport();

    // 设置事件委托
    setupEventDelegation();

    // 增强侧边栏导航
    enhanceSidebarNavigation();

    // 设置 Intersection Observer
    setupIntersectionObserver();

    // 添加响应式指示器（开发模式）
    addResponsiveIndicator();

    // 宣布页面加载完成
    announceToScreenReader('页面加载完成，可以开始浏览');

    console.log('✓ 无障碍访问和性能优化增强已启用');
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ========================================
  // 导出 API
  // ========================================

  window.AccessibilityEnhancements = {
    announceToScreenReader,
    createFocusTrap,
    debounce,
    throttle,
  };
})();
