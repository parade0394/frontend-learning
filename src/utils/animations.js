/**
 * 动画相关工具函数
 */

import { prefersReducedMotion } from './helpers.js';

/**
 * 播放动画 - 通过添加/移除类名触发CSS动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} className - 动画类名
 * @param {number} duration - 动画持续时间（毫秒）
 */
export function playAnimation(element, className, duration = 1500) {
  if (prefersReducedMotion()) {
    return;
  }

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
 * @param {string|string[]|null} classNames - 要移除的类名
 */
export function resetAnimation(element, classNames = null) {
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
 * @param {HTMLElement} element - 目标元素
 * @param {string} transformValue - transform 的值
 * @param {number} duration - 动画持续时间（毫秒）
 */
export function playTransform(element, transformValue, duration = 1500) {
  if (prefersReducedMotion()) {
    return;
  }

  // 重置 transform
  element.style.transform = 'none';

  // 强制重排
  void element.offsetHeight;

  // 应用 transform
  element.style.transform = transformValue;

  // 动画结束后重置
  setTimeout(() => {
    element.style.transform = 'none';
  }, duration);
}
