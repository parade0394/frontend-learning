---
inclusion: always
---

# 前端学习中心项目规范

## 核心原则

1. **简洁性优先** - 使用原生 HTML/CSS/JavaScript，避免引入框架和构建工具
2. **教育导向** - 代码应清晰易懂，适合学习者阅读和理解
3. **交互性** - 每个演示都应该是可交互的，让学习者动手实践
4. **响应式设计** - 所有页面必须在桌面和移动端都能良好显示
5. **一致性** - 使用统一的设计系统和代码风格

## 项目结构

```
frontend-learning/
├── index.html              # 主入口页面
├── shared/                 # 公共资源（必须复用）
│   ├── common.css          # 公共样式和 CSS 变量
│   ├── theme.js            # 完整主题系统（用于主页和模块首页）
│   ├── theme-sync.js       # 轻量主题同步（用于 demo 页面）
│   └── utils.js            # 公共工具函数
├── animation/              # CSS 动画模块
│   ├── index.html          # 模块主页
│   ├── styles.css          # 模块专用样式
│   └── demos/              # 演示页面
├── grid/                   # CSS Grid 布局模块
│   ├── index.html          # 模块主页
│   └── demo*.html          # 演示页面
├── box-shadow/             # Box-Shadow 工具模块
│   └── index.html
└── scripts/                # 工具脚本
```

## 代码规范

### HTML 规范

1. **语义化标签** - 使用语义化的 HTML5 标签（header, section, footer 等）
2. **中文语言** - 所有页面使用 `lang="zh-CN"`
3. **响应式视口** - 必须包含 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
4. **引用公共资源** - 所有页面必须引用 `shared/common.css`
5. **主题系统**：
   - 主页和模块首页使用 `<script src="shared/theme.js"></script>`
   - Demo 页面使用 `<script src="../../shared/theme-sync.js"></script>`（轻量级）
6. **返回链接** - 所有子页面应包含返回上级的链接，使用 `.back-link` 样式类

### CSS 规范

1. **使用 CSS 变量** - 必须使用 `common.css` 中定义的 CSS 变量
   - 颜色：`var(--primary)`, `var(--text-primary)`, `var(--bg-secondary)` 等
   - 间距：`var(--spacing-sm)`, `var(--spacing-md)`, `var(--spacing-lg)` 等
   - 圆角：`var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)` 等
   - 阴影：`var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)` 等
   - 过渡：`var(--transition-fast)`, `var(--transition-base)`, `var(--transition-slow)` 等

2. **主题支持** - 所有自定义样式必须支持亮色/暗色主题
   ```css
   /* 使用主题变量 */
   background: var(--bg-primary);
   color: var(--text-primary);
   border: 1px solid var(--border-color);
   ```

3. **复用通用组件** - 优先使用 `common.css` 中的组件类
   - `.btn` - 按钮样式
   - `.card` - 卡片样式
   - `.code-block` - 代码块样式
   - `.demo-area` - 演示区域
   - `.demo-box` - 演示盒子
   - `.back-link` - 返回链接

4. **响应式设计** - 使用移动端优先的响应式设计
   ```css
   /* 移动端优先 */
   .element { /* 基础样式 */ }
   
   /* 平板和桌面端 */
   @media (max-width: 768px) { /* 调整样式 */ }
   @media (max-width: 480px) { /* 小屏幕调整 */ }
   ```

5. **命名规范** - 使用 BEM 命名规范或语义化类名
   - 模块级：`.module-card`, `.demo-grid`
   - 元素级：`.card-icon`, `.hero-content`
   - 状态级：`.active`, `.featured`

### JavaScript 规范

1. **使用 ES6+ 语法** - 使用现代 JavaScript 特性
   - 使用 `const` 和 `let`，避免 `var`
   - 使用箭头函数
   - 使用模板字符串
   - 使用解构赋值

2. **复用工具函数** - 优先使用 `shared/utils.js` 中的工具函数
   - `playAnimation(element, className, duration)` - 播放 CSS 动画
   - `resetAnimation(element, classNames)` - 重置动画
   - `playTransform(element, transformValue, duration)` - 播放 transform 动画
   - `debounce(fn, delay)` - 防抖
   - `throttle(fn, interval)` - 节流
   - `copyToClipboard(text)` - 复制到剪贴板
   - `showToast(message, type, duration)` - 显示提示消息
   - `storage.set/get/remove/clear` - 本地存储

3. **IIFE 模式** - 全局脚本使用立即执行函数避免污染全局作用域
   ```javascript
   (function() {
     'use strict';
     // 代码
   })();
   ```

4. **事件监听** - 使用事件委托优化性能
   ```javascript
   document.addEventListener('click', (e) => {
     if (e.target.matches('.btn')) {
       // 处理点击
     }
   });
   ```

5. **注释规范** - 使用 JSDoc 风格的注释
   ```javascript
   /**
    * 函数描述
    * @param {Type} paramName - 参数描述
    * @returns {Type} 返回值描述
    */
   ```

## 设计系统

### 颜色系统

项目使用可定制的主题颜色系统：

- **主色调**：`--primary` (默认 #10b981 翡翠绿)
  - 可通过主题面板切换：天空蓝、紫罗兰、琥珀橙、玫瑰粉
- **中性色**：`--gray-50` 到 `--gray-900`
- **语义色**：`--success`, `--warning`, `--error`, `--info`
- **主题变量**：`--bg-primary`, `--text-primary`, `--border-color` 等（支持亮色/暗色模式）

### 间距系统

- `--spacing-xs`: 8px
- `--spacing-sm`: 12px
- `--spacing-md`: 20px
- `--spacing-lg`: 30px
- `--spacing-xl`: 40px

### 字体系统

- `--font-base`: 系统字体栈（-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto...）
- `--font-mono`: 等宽字体（'SF Mono', 'Monaco', 'Inconsolata'...）

## 主题系统

### 主题模式

项目支持三种主题模式：
1. **亮色模式** - 默认模式
2. **暗色模式** - 深色背景
3. **跟随系统** - 自动跟随操作系统设置

### 主题文件使用

- **theme.js** - 完整主题系统，包含 UI 控件（工具栏、面板）
  - 用于：主页 (index.html)、模块首页 (animation/index.html, grid/index.html)
  - 功能：暗色模式切换、主题颜色定制、UI 面板

- **theme-sync.js** - 轻量级主题同步
  - 用于：所有 demo 演示页面
  - 功能：仅同步主题设置，无 UI 控件，减少页面负担

### 主题变量

所有自定义样式必须使用主题变量以支持暗色模式：

```css
/* ✅ 正确 - 使用主题变量 */
background: var(--bg-primary);
color: var(--text-primary);
border: 1px solid var(--border-color);

/* ❌ 错误 - 硬编码颜色 */
background: #ffffff;
color: #000000;
border: 1px solid #e5e7eb;
```

## 新增模块指南

### 1. 创建模块目录

```
new-module/
├── index.html          # 模块主页（必需）
├── styles.css          # 模块专用样式（可选）
└── demos/              # 演示页面（可选）
```

### 2. 模块主页模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>模块名称</title>
  <link rel="stylesheet" href="../shared/common.css">
  <script src="../shared/theme.js"></script>
  <style>
    /* 模块特定样式 */
  </style>
</head>
<body>
  <div class="container">
    <header>
      <a href="../index.html" class="back-link">← 返回首页</a>
      <h1>模块名称</h1>
      <p>模块描述</p>
    </header>
    
    <!-- 内容 -->
  </div>
</body>
</html>
```

### 3. Demo 页面模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo 名称</title>
  <link rel="stylesheet" href="../../shared/common.css">
  <script src="../../shared/theme-sync.js"></script>
  <script src="../../shared/utils.js"></script>
  <style>
    /* Demo 特定样式 */
  </style>
</head>
<body>
  <div class="container">
    <a href="../index.html" class="back-link">← 返回模块首页</a>
    
    <h1>Demo 标题</h1>
    
    <!-- 演示区域 -->
    <div class="demo-area">
      <div class="demo-box">演示</div>
    </div>
    
    <!-- 代码示例 -->
    <div class="code-block">
      <code>/* CSS 代码 */</code>
    </div>
  </div>
  
  <script>
    // Demo 交互逻辑
  </script>
</body>
</html>
```

### 4. 更新主页

在 `index.html` 中添加模块卡片：

```html
<a href="new-module/index.html" class="card module-card">
  <span class="module-icon">🎯</span>
  <h2>模块名称</h2>
  <p>模块描述</p>
  <div class="module-meta">
    <span>📚 X 个知识点</span>
    <span>🎮 X 个演示</span>
    <span>⏱️ X 小时</span>
  </div>
</a>
```

## 文件命名规范

- **HTML 文件**：小写字母，使用连字符分隔（kebab-case）
  - 示例：`index.html`, `demo1-basic.html`, `product-demo.html`
- **CSS 文件**：小写字母，使用连字符分隔
  - 示例：`common.css`, `styles.css`
- **JavaScript 文件**：小写字母，使用连字符分隔
  - 示例：`theme.js`, `utils.js`, `theme-sync.js`
- **目录名**：小写字母，使用连字符分隔
  - 示例：`box-shadow/`, `animation/demos/`

## 性能优化

1. **CSS 优化**
   - 使用 CSS 变量减少重复代码
   - 避免深层嵌套选择器（最多 3 层）
   - 使用 `will-change` 提示浏览器优化动画

2. **JavaScript 优化**
   - 使用事件委托减少事件监听器数量
   - 使用防抖和节流优化高频事件
   - 避免在循环中操作 DOM

3. **资源加载**
   - CSS 放在 `<head>` 中
   - JavaScript 放在 `</body>` 前或使用 `defer`
   - 图片使用适当的格式和尺寸

## 浏览器兼容性

- **目标浏览器**：现代浏览器（Chrome, Firefox, Safari, Edge）最新两个版本
- **不支持**：IE 11 及以下
- **CSS 特性**：可以使用 CSS Grid, Flexbox, CSS Variables, CSS Animations
- **JavaScript 特性**：可以使用 ES6+ 特性

## 可访问性

1. **语义化 HTML** - 使用正确的标签表达内容结构
2. **键盘导航** - 确保所有交互元素可通过键盘访问
3. **颜色对比度** - 确保文本和背景有足够的对比度
4. **替代文本** - 为图片和图标提供有意义的描述
5. **焦点样式** - 保留或自定义焦点指示器

## 测试清单

在提交代码前，请确保：

- [ ] 在 Chrome、Firefox、Safari 中测试
- [ ] 在桌面端和移动端测试
- [ ] 测试亮色和暗色主题
- [ ] 测试所有主题颜色
- [ ] 检查响应式布局
- [ ] 验证所有链接可用
- [ ] 检查控制台无错误
- [ ] 验证代码符合规范
