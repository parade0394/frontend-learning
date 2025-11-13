/**
 * 返回顶部按钮组件
 * 自动检测滚动容器并显示/隐藏按钮
 */

import { throttle } from '../utils/helpers.js';

export class BackToTop {
  constructor() {
    this.button = null;
    this.scrollContainer = null;
    this.isWindow = false;
    this.init();
  }

  init() {
    // 检查是否已经存在按钮，避免重复创建
    if (document.querySelector('.back-to-top')) {
      return;
    }

    this.createButton();
    this.detectScrollContainer();
    this.bindEvents();
    this.checkScroll();
  }

  createButton() {
    this.button = document.createElement('button');
    this.button.className = 'back-to-top';
    this.button.innerHTML = '↑';
    this.button.setAttribute('aria-label', '返回顶部');
    this.button.setAttribute('title', '返回顶部');
    document.body.appendChild(this.button);
  }

  detectScrollContainer() {
    // 检测实际的滚动容器（可能是 window 或 .main-content）
    this.scrollContainer = document.querySelector('.main-content') || window;
    this.isWindow = this.scrollContainer === window;
  }

  checkScroll() {
    const scrollTop = this.isWindow
      ? window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      : this.scrollContainer.scrollTop;

    if (scrollTop > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    if (this.isWindow) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      this.scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  bindEvents() {
    // 滚动监听（使用节流优化）
    const throttledCheck = throttle(() => this.checkScroll(), 100);
    this.scrollContainer.addEventListener('scroll', throttledCheck, { passive: true });

    // 点击事件
    this.button.addEventListener('click', () => this.scrollToTop());
  }
}
