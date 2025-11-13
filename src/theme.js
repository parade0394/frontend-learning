/**
 * 主题系统入口文件
 * 用于主页和模块首页
 */

import { ThemeSystem } from './components/ThemeSystem.js';
import { BackToTop } from './components/BackToTop.js';

// 初始化主题系统
new ThemeSystem();

// 初始化返回顶部按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
  });
} else {
  new BackToTop();
}
