/**
 * CSS Modern Selectors - Browser Compatibility Detection
 * 检测现代 CSS 选择器的浏览器支持情况
 */

(function () {
  'use strict';

  // 选择器支持检测配置
  const SELECTORS_TO_CHECK = {
    ':has()': {
      selector: ':has(*)',
      name: ':has() 伪类',
      description: '父选择器，根据子元素选择父元素',
      fallback: '使用 JavaScript 添加类名实现类似功能',
      critical: true,
    },
    ':is()': {
      selector: ':is(div, span)',
      name: ':is() 伪类',
      description: '简化选择器列表',
      fallback: '使用传统的逗号分隔选择器',
      critical: false,
    },
    ':where()': {
      selector: ':where(div, span)',
      name: ':where() 伪类',
      description: '零权重的选择器列表',
      fallback: '使用 :is() 或传统选择器',
      critical: false,
    },
    ':not()': {
      selector: ':not(.class)',
      name: ':not() 伪类',
      description: '排除选择器',
      fallback: '基础的 :not() 在所有现代浏览器都支持',
      critical: false,
    },
    ':focus-within': {
      selector: ':focus-within',
      name: ':focus-within 伪类',
      description: '内部元素获得焦点时选择父元素',
      fallback: '使用 JavaScript 监听 focus 事件',
      critical: false,
    },
    ':focus-visible': {
      selector: ':focus-visible',
      name: ':focus-visible 伪类',
      description: '仅在键盘导航时显示焦点样式',
      fallback: '使用 :focus 伪类',
      critical: false,
    },
  };

  /**
   * 检测浏览器是否支持指定的 CSS 选择器
   * @param {string} selector - 要检测的选择器
   * @returns {boolean} 是否支持
   */
  function supportsSelector(selector) {
    try {
      // 方法 1: 使用 CSS.supports (推荐)
      if (window.CSS && window.CSS.supports) {
        return CSS.supports('selector(' + selector + ')');
      }

      // 方法 2: 尝试使用 querySelector (降级方案)
      document.querySelector(selector);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 检测所有配置的选择器支持情况
   * @returns {Object} 检测结果对象
   */
  function checkAllSelectors() {
    const results = {};
    let hasUnsupported = false;
    let hasCriticalUnsupported = false;

    for (const [_key, config] of Object.entries(SELECTORS_TO_CHECK)) {
      const supported = supportsSelector(config.selector);
      results[_key] = {
        ...config,
        supported,
      };

      if (!supported) {
        hasUnsupported = true;
        if (config.critical) {
          hasCriticalUnsupported = true;
        }
      }
    }

    return {
      results,
      hasUnsupported,
      hasCriticalUnsupported,
    };
  }

  /**
   * 创建兼容性警告横幅
   * @param {Object} checkResults - 检测结果
   */
  function createCompatibilityBanner(checkResults) {
    // 如果所有选择器都支持，不显示警告
    if (!checkResults.hasUnsupported) {
      return;
    }

    // 创建警告横幅
    const banner = document.createElement('div');
    banner.className = 'compatibility-warning';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');

    const unsupportedSelectors = Object.entries(checkResults.results)
      .filter(([_, config]) => !config.supported)
      .map(([_, config]) => config.name);

    const isCritical = checkResults.hasCriticalUnsupported;
    const severity = isCritical ? 'critical' : 'warning';

    banner.innerHTML = `
      <div class="compatibility-warning-content ${severity}">
        <div class="warning-icon">
          ${isCritical ? '⚠️' : 'ℹ️'}
        </div>
        <div class="warning-text">
          <strong>${isCritical ? '浏览器兼容性警告' : '部分功能不支持'}</strong>
          <p>您的浏览器不支持以下 CSS 选择器：</p>
          <ul>
            ${unsupportedSelectors.map((name) => `<li>${name}</li>`).join('')}
          </ul>
          <p class="warning-suggestion">
            ${
              isCritical
                ? '建议使用最新版本的 Chrome、Firefox、Safari 或 Edge 浏览器以获得最佳体验。'
                : '部分演示效果可能无法正常显示，但不影响学习核心概念。'
            }
          </p>
        </div>
        <button class="warning-close" aria-label="关闭警告" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `;

    // 插入到页面顶部
    document.body.insertBefore(banner, document.body.firstChild);
  }

  /**
   * 创建详细的兼容性报告（用于兼容性信息区域）
   * @param {Object} checkResults - 检测结果
   * @returns {HTMLElement} 兼容性报告元素
   */
  function createCompatibilityReport(checkResults) {
    const report = document.createElement('div');
    report.className = 'compatibility-report';

    const rows = Object.entries(checkResults.results)
      .map(([_key, config]) => {
        const statusClass = config.supported ? 'support-yes' : 'support-no';
        const statusText = config.supported ? '✓ 支持' : '✗ 不支持';
        const fallbackInfo = config.supported
          ? ''
          : `<div class="fallback-info"><strong>降级方案：</strong>${config.fallback}</div>`;

        return `
        <tr>
          <td><strong>${config.name}</strong></td>
          <td>${config.description}</td>
          <td class="${statusClass}">${statusText}</td>
        </tr>
        ${fallbackInfo ? `<tr class="fallback-row"><td colspan="3">${fallbackInfo}</td></tr>` : ''}
      `;
      })
      .join('');

    report.innerHTML = `
      <h3>当前浏览器支持情况</h3>
      <table class="compatibility-table">
        <thead>
          <tr>
            <th>选择器</th>
            <th>说明</th>
            <th>支持状态</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p class="compatibility-note">
        <strong>检测方法：</strong>使用 <code>CSS.supports('selector(...)')</code> API 进行特性检测。
      </p>
    `;

    return report;
  }

  /**
   * 添加降级样式
   */
  function addFallbackStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 兼容性警告横幅样式 */
      .compatibility-warning {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }

      .compatibility-warning-content {
        display: flex;
        gap: 15px;
        padding: 20px;
        background: var(--warning-light, #fef3c7);
        border-bottom: 3px solid var(--warning, #f59e0b);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .compatibility-warning-content.critical {
        background: var(--error-light, #fee2e2);
        border-bottom-color: var(--error, #ef4444);
      }

      .warning-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }

      .warning-text {
        flex: 1;
        color: var(--text-primary, #111827);
      }

      .warning-text strong {
        display: block;
        font-size: 1.1rem;
        margin-bottom: 8px;
        color: var(--warning-dark, #92400e);
      }

      .compatibility-warning-content.critical .warning-text strong {
        color: var(--error-dark, #991b1b);
      }

      .warning-text p {
        margin: 8px 0;
        line-height: 1.6;
      }

      .warning-text ul {
        margin: 8px 0;
        padding-left: 20px;
      }

      .warning-text li {
        margin: 4px 0;
      }

      .warning-suggestion {
        font-size: 0.9rem;
        font-style: italic;
        margin-top: 12px !important;
      }

      .warning-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary, #6b7280);
        padding: 0;
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        transition: all 0.2s;
        border-radius: 4px;
      }

      .warning-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--text-primary, #111827);
      }

      /* 兼容性报告样式 */
      .compatibility-report {
        margin: 20px 0;
        padding: 20px;
        background: var(--bg-secondary, #f9fafb);
        border-radius: 8px;
        border: 2px solid var(--border-color, #e5e7eb);
      }

      .compatibility-report h3 {
        margin-top: 0;
        color: var(--text-primary, #111827);
      }

      .compatibility-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        background: var(--bg-primary, #ffffff);
      }

      .compatibility-table th,
      .compatibility-table td {
        padding: 12px;
        text-align: left;
        border: 1px solid var(--border-color, #e5e7eb);
      }

      .compatibility-table th {
        background: var(--bg-secondary, #f9fafb);
        font-weight: 600;
        color: var(--text-primary, #111827);
      }

      .compatibility-table .support-yes {
        color: var(--success, #10b981);
        font-weight: 600;
      }

      .compatibility-table .support-no {
        color: var(--error, #ef4444);
        font-weight: 600;
      }

      .fallback-row {
        background: var(--warning-light, #fef3c7);
      }

      .fallback-info {
        padding: 8px;
        font-size: 0.9rem;
        color: var(--text-primary, #111827);
      }

      .fallback-info strong {
        color: var(--warning-dark, #92400e);
      }

      .compatibility-note {
        margin-top: 15px;
        padding: 12px;
        background: var(--bg-primary, #ffffff);
        border-left: 4px solid var(--primary, #10b981);
        border-radius: 4px;
        font-size: 0.9rem;
        color: var(--text-secondary, #6b7280);
      }

      .compatibility-note code {
        background: var(--gray-700, #374151);
        color: var(--gray-200, #e5e7eb);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: var(--font-mono, 'Courier New', monospace);
      }

      /* 响应式调整 */
      @media (max-width: 768px) {
        .compatibility-warning-content {
          flex-direction: column;
          padding: 15px;
        }

        .warning-icon {
          font-size: 1.5rem;
        }

        .compatibility-table {
          font-size: 0.9rem;
        }

        .compatibility-table th,
        .compatibility-table td {
          padding: 8px;
        }
      }

      /* 为不支持 :has() 的浏览器提供降级样式 */
      @supports not selector(:has(*)) {
        .demo-section {
          border-left: 4px solid var(--warning, #f59e0b);
          padding-left: 15px;
        }

        .demo-section::before {
          content: '⚠️ 此演示需要 :has() 支持';
          display: block;
          padding: 8px 12px;
          background: var(--warning-light, #fef3c7);
          color: var(--warning-dark, #92400e);
          border-radius: 4px;
          margin-bottom: 15px;
          font-weight: 600;
          font-size: 0.9rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 初始化兼容性检测
   */
  function init() {
    // 添加降级样式
    addFallbackStyles();

    // 执行检测
    const checkResults = checkAllSelectors();

    // 显示警告横幅（如果需要）
    createCompatibilityBanner(checkResults);

    // 如果页面有兼容性信息区域，插入详细报告
    const compatibilitySection = document.querySelector('.compatibility-section');
    if (compatibilitySection) {
      const report = createCompatibilityReport(checkResults);
      compatibilitySection.appendChild(report);
    }

    // 将检测结果暴露到全局，供其他脚本使用
    window.CSS_SELECTOR_SUPPORT = checkResults;

    // 在控制台输出检测结果
    console.log('CSS Selector Compatibility Check:', checkResults);
  }

  // 页面加载完成后执行检测
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露检测函数供外部使用
  window.checkSelectorSupport = supportsSelector;
  window.checkAllSelectorSupport = checkAllSelectors;
})();
