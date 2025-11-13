/**
 * 工具函数入口文件
 * 导出所有工具函数供页面使用
 */

// 动画工具
export { playAnimation, resetAnimation, playTransform } from './utils/animations.js';

// 通用工具
export { debounce, throttle, isMobile, scrollToElement, prefersReducedMotion } from './utils/helpers.js';

// 剪贴板
export { copyToClipboard } from './utils/clipboard.js';

// Toast 提示
export { showToast } from './utils/toast.js';

// 本地存储
export { storage } from './utils/storage.js';

// 返回顶部组件
import { BackToTop } from './components/BackToTop.js';

// 自动初始化返回顶部按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
  });
} else {
  new BackToTop();
}
