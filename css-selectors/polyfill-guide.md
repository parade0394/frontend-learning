# CSS 现代选择器 - Polyfill 和降级方案指南

## 概述

本文档提供了针对不支持现代 CSS 选择器的浏览器的 polyfill 方案和降级策略。

## :has() 伪类

### 浏览器支持

- Chrome/Edge: 105+
- Firefox: 121+
- Safari: 15.4+

### JavaScript Polyfill

由于 `:has()` 的复杂性，完整的 polyfill 较为困难。推荐的降级方案：

```javascript
// 方案 1: 使用 JavaScript 添加类名
function polyfillHas() {
  // 示例：.card:has(img)
  document.querySelectorAll('.card').forEach((card) => {
    if (card.querySelector('img')) {
      card.classList.add('has-image');
    }
  });

  // 示例：form:has(input:invalid)
  document.querySelectorAll('form').forEach((form) => {
    const hasInvalid = form.querySelector('input:invalid');
    form.classList.toggle('has-invalid', !!hasInvalid);
  });
}

// 在 DOM 变化时重新检查
const observer = new MutationObserver(polyfillHas);
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'value'],
});

// 初始执行
polyfillHas();
```

```css
/* 使用添加的类名替代 :has() */
.card.has-image {
  /* 原本的 .card:has(img) 样式 */
}

.form.has-invalid {
  /* 原本的 form:has(input:invalid) 样式 */
}
```

### 方案 2: 使用第三方库

```html
<!-- 使用 CSS.supports polyfill -->
<script src="https://unpkg.com/css-has-pseudo@latest/browser.js"></script>
```

## :is() 和 :where() 伪类

### 浏览器支持

- Chrome/Edge: 88+
- Firefox: 78+
- Safari: 14+

### 降级方案

这两个选择器的降级相对简单，使用传统的逗号分隔选择器：

```css
/* 原始代码 */
:is(.header, .footer, .sidebar) a {
  color: blue;
}

/* 降级方案 */
.header a,
.footer a,
.sidebar a {
  color: blue;
}
```

### 注意事项

- `:is()` 的优先级取列表中最高的选择器
- `:where()` 的优先级始终为 0
- 降级时需要注意优先级的变化

## :focus-within 伪类

### 浏览器支持

- Chrome/Edge: 60+
- Firefox: 52+
- Safari: 10.1+

### JavaScript Polyfill

```javascript
// :focus-within polyfill
(function () {
  if (!CSS.supports('selector(:focus-within)')) {
    document.addEventListener(
      'focus',
      function (e) {
        let parent = e.target.parentElement;
        while (parent) {
          parent.classList.add('focus-within');
          parent = parent.parentElement;
        }
      },
      true
    );

    document.addEventListener(
      'blur',
      function (e) {
        let parent = e.target.parentElement;
        while (parent) {
          if (!parent.querySelector(':focus')) {
            parent.classList.remove('focus-within');
          }
          parent = parent.parentElement;
        }
      },
      true
    );
  }
})();
```

```css
/* 使用 polyfill 添加的类 */
.form-container.focus-within {
  /* 原本的 .form-container:focus-within 样式 */
}
```

## :focus-visible 伪类

### 浏览器支持

- Chrome/Edge: 86+
- Firefox: 85+
- Safari: 15.4+

### JavaScript Polyfill

```javascript
// :focus-visible polyfill
(function () {
  if (!CSS.supports('selector(:focus-visible)')) {
    let hadKeyboardEvent = false;

    document.addEventListener('keydown', function () {
      hadKeyboardEvent = true;
    });

    document.addEventListener('mousedown', function () {
      hadKeyboardEvent = false;
    });

    document.addEventListener(
      'focus',
      function (e) {
        if (hadKeyboardEvent) {
          e.target.classList.add('focus-visible');
        }
      },
      true
    );

    document.addEventListener(
      'blur',
      function (e) {
        e.target.classList.remove('focus-visible');
      },
      true
    );
  }
})();
```

```css
/* 降级样式 */
button.focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

### 推荐的第三方 Polyfill

```html
<script src="https://unpkg.com/focus-visible@latest/dist/focus-visible.min.js"></script>
```

## :not() 伪类（复杂选择器）

### 浏览器支持

- 基础 `:not()`: 所有现代浏览器
- 复杂选择器支持: Chrome/Edge 88+, Firefox 84+, Safari 9+

### 降级方案

```css
/* 原始代码（复杂选择器） */
.item:not(.active, .disabled) {
  opacity: 1;
}

/* 降级方案（链式 :not()） */
.item:not(.active):not(.disabled) {
  opacity: 1;
}
```

## 通用降级策略

### 1. 特性检测

```javascript
// 检测选择器支持
function supportsSelector(selector) {
  try {
    if (CSS.supports('selector(' + selector + ')')) {
      return true;
    }
    document.querySelector(selector);
    return true;
  } catch (e) {
    return false;
  }
}

// 使用
if (supportsSelector(':has(*)')) {
  // 使用 :has()
} else {
  // 使用降级方案
}
```

### 2. 渐进增强

```css
/* 基础样式（所有浏览器） */
.card {
  border: 1px solid gray;
}

/* 增强样式（支持 :has() 的浏览器） */
@supports selector(:has(*)) {
  .card:has(img) {
    border-color: blue;
  }
}
```

### 3. 添加 HTML 类名

```html
<html class="no-has no-focus-visible">
  <!-- 通过 JavaScript 检测并移除不支持的类 -->
</html>
```

```javascript
// 检测并更新 HTML 类名
if (supportsSelector(':has(*)')) {
  document.documentElement.classList.remove('no-has');
}
if (supportsSelector(':focus-visible')) {
  document.documentElement.classList.remove('no-focus-visible');
}
```

```css
/* 针对不支持的浏览器 */
.no-has .card[data-has-image] {
  /* 降级样式 */
}
```

## 推荐的 Polyfill 库

### 1. PostCSS Plugins

```bash
npm install postcss-preset-env
```

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'focus-visible-pseudo-class': true,
        'focus-within-pseudo-class': true,
      },
    }),
  ],
};
```

### 2. CSS Has Pseudo

```bash
npm install css-has-pseudo
```

```javascript
import cssHasPseudo from 'css-has-pseudo';
cssHasPseudo(document);
```

### 3. Focus Visible Polyfill

```bash
npm install focus-visible
```

```javascript
import 'focus-visible';
```

## 浏览器兼容性表

| 选择器         | Chrome | Firefox | Safari | Edge |
| -------------- | ------ | ------- | ------ | ---- |
| :has()         | 105+   | 121+    | 15.4+  | 105+ |
| :is()          | 88+    | 78+     | 14+    | 88+  |
| :where()       | 88+    | 78+     | 14+    | 88+  |
| :not() (复杂)  | 88+    | 84+     | 9+     | 88+  |
| :focus-within  | 60+    | 52+     | 10.1+  | 79+  |
| :focus-visible | 86+    | 85+     | 15.4+  | 86+  |

## 测试工具

### 1. Can I Use

https://caniuse.com/

### 2. MDN Browser Compatibility Data

https://github.com/mdn/browser-compat-data

### 3. CSS Feature Queries

```css
@supports selector(:has(*)) {
  /* 支持的样式 */
}
```

## 最佳实践

1. **优先使用 @supports** - 在 CSS 中使用特性查询
2. **渐进增强** - 先提供基础样式，再添加增强样式
3. **避免过度 polyfill** - 只为关键功能添加 polyfill
4. **性能考虑** - JavaScript polyfill 可能影响性能
5. **用户提示** - 为不支持的浏览器显示友好提示
6. **定期更新** - 随着浏览器更新，逐步移除 polyfill

## 参考资源

- [MDN: CSS :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [MDN: CSS :is()](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)
- [MDN: CSS :where()](https://developer.mozilla.org/en-US/docs/Web/CSS/:where)
- [MDN: CSS :focus-within](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)
- [MDN: CSS :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [Can I Use](https://caniuse.com/)
- [PostCSS Preset Env](https://preset-env.cssdb.org/)
