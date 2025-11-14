# Iconify 图标系统集成指南

## 为什么使用 Iconify？

### 当前问题（使用 Emoji）

- ❌ 不同操作系统显示不一致
- ❌ 无法精确控制大小和颜色
- ❌ 可访问性支持有限
- ❌ 无法使用专业图标

### Iconify 优势

- ✅ 统一的跨平台显示
- ✅ 100,000+ 开源图标
- ✅ 按需加载，性能优秀
- ✅ 完整的 CSS 控制
- ✅ 支持 SVG 和 Web Component

## 集成方案

### 方案 1：CDN 引入（推荐用于快速开始）

#### 1. 在 `shared/common.css` 之后添加

```html
<!-- Iconify Web Component -->
<script src="https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js"></script>
```

#### 2. 使用图标

```html
<!-- 替换 emoji -->
<iconify-icon icon="mdi:animation" width="48" height="48"></iconify-icon>
<iconify-icon icon="mdi:grid" width="48" height="48"></iconify-icon>
<iconify-icon icon="mdi:vector-square" width="48" height="48"></iconify-icon>
```

#### 3. 样式控制

```css
iconify-icon {
  color: var(--primary);
  transition: color 0.2s ease;
}

.card:hover iconify-icon {
  color: var(--primary-dark);
}
```

### 方案 2：本地安装（推荐用于生产环境）

#### 1. 安装依赖

```bash
npm install --save-dev @iconify/json @iconify/tools
```

#### 2. 创建图标提取脚本

```javascript
// scripts/extract-icons.js
import { promises as fs } from 'fs';
import { getIconData, iconToSVG, iconToHTML } from '@iconify/utils';
import { locate } from '@iconify/json';

const icons = [
  'mdi:animation',
  'mdi:grid',
  'mdi:vector-square',
  'mdi:palette',
  'mdi:lightbulb',
  // 添加所有需要的图标
];

async function extractIcons() {
  const svgs = {};

  for (const icon of icons) {
    const [prefix, name] = icon.split(':');
    const filename = locate(prefix);
    const data = JSON.parse(await fs.readFile(filename, 'utf8'));
    const iconData = getIconData(data, name);

    if (iconData) {
      const svg = iconToSVG(iconData);
      svgs[icon] = iconToHTML(svg.body, svg.attributes);
    }
  }

  await fs.writeFile('shared/icons.json', JSON.stringify(svgs, null, 2));
}

extractIcons();
```

#### 3. 创建图标组件

```javascript
// shared/icon.js
const icons = await fetch('shared/icons.json').then((r) => r.json());

class Icon extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name');
    const size = this.getAttribute('size') || '24';

    if (icons[name]) {
      this.innerHTML = icons[name]
        .replace(/width="\d+"/, `width="${size}"`)
        .replace(/height="\d+"/, `height="${size}"`);
    }
  }
}

customElements.define('app-icon', Icon);
```

#### 4. 使用

```html
<script src="shared/icon.js" type="module"></script>
<app-icon name="mdi:animation" size="48"></app-icon>
```

## 图标映射表

### 当前 Emoji → Iconify 图标

| 当前 | Emoji | Iconify 图标                  | 说明             |
| ---- | ----- | ----------------------------- | ---------------- |
| 主页 | 🎬    | `mdi:animation`               | CSS 动画         |
| 主页 | 📐    | `mdi:grid`                    | Grid 布局        |
| 主页 | 💡    | `mdi:lightbulb-on`            | Box-Shadow       |
| 主页 | 🎨    | `mdi:palette`                 | SVG 图形         |
| 动画 | 📍    | `mdi:map-marker`              | 坐标系统         |
| 动画 | ↔️    | `mdi:arrow-expand-horizontal` | translate        |
| 动画 | 🔄    | `mdi:rotate-right`            | rotate           |
| 动画 | 🔍    | `mdi:magnify`                 | scale            |
| 动画 | 📐    | `mdi:angle-acute`             | skew             |
| 动画 | ⏰    | `mdi:clock-outline`           | duration         |
| 动画 | 📈    | `mdi:chart-line`              | timing           |
| 动画 | ⏳    | `mdi:timer-sand`              | delay            |
| 动画 | 🎞️    | `mdi:filmstrip`               | keyframes        |
| 动画 | 👁️    | `mdi:eye`                     | perspective      |
| 动画 | 🎯    | `mdi:target`                  | transform-origin |
| 动画 | ⚡    | `mdi:flash`                   | will-change      |

### 推荐图标集

- **Material Design Icons (mdi)**: 最全面，7000+ 图标
- **Lucide**: 现代简洁，300+ 图标
- **Heroicons**: Tailwind 官方，200+ 图标
- **Carbon**: IBM 设计系统，2000+ 图标

## 实施步骤

### 第一阶段：主页和模块首页

1. 在 `index.html` 添加 Iconify CDN
2. 替换主页的 4 个模块图标
3. 替换各模块首页的图标
4. 测试主题切换和响应式

### 第二阶段：演示页面

1. 替换所有演示卡片的图标
2. 统一图标大小和样式
3. 添加悬停效果

### 第三阶段：优化

1. 收集所有使用的图标
2. 使用本地方案减少网络请求
3. 优化加载性能

## 样式示例

### 基础样式

```css
/* 图标容器 */
.icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  border-radius: var(--radius-lg);
  border: 2px solid var(--primary);
  transition: all 0.3s ease;
}

/* 图标本身 */
iconify-icon {
  color: var(--primary);
  font-size: 32px;
  transition: transform 0.3s ease;
}

/* 悬停效果 */
.card:hover .icon-wrapper {
  transform: scale(1.1);
  background: var(--primary);
}

.card:hover iconify-icon {
  color: white;
  transform: rotate(10deg);
}
```

### 主题适配

```css
/* 暗色模式 */
[data-theme='dark'] iconify-icon {
  filter: brightness(1.2);
}

/* 不同主题颜色 */
:root {
  --icon-color: var(--primary);
}

iconify-icon {
  color: var(--icon-color);
}
```

## 性能考虑

### CDN 方案

- **优点**：简单快速，自动缓存
- **缺点**：依赖外部服务，首次加载稍慢
- **适用**：快速原型，小型项目

### 本地方案

- **优点**：完全控制，无外部依赖
- **缺点**：需要构建步骤
- **适用**：生产环境，大型项目

### 混合方案

- 常用图标本地化
- 不常用图标使用 CDN
- 最佳性能和灵活性

## 可访问性

### 添加标签

```html
<!-- 装饰性图标 -->
<iconify-icon icon="mdi:animation" aria-hidden="true"></iconify-icon>

<!-- 功能性图标 -->
<iconify-icon icon="mdi:close" role="img" aria-label="关闭"></iconify-icon>
```

### 与文本结合

```html
<button>
  <iconify-icon icon="mdi:play" aria-hidden="true"></iconify-icon>
  <span>播放动画</span>
</button>
```

## 浏览器兼容性

Iconify Web Component 支持：

- ✅ Chrome 54+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

对于旧浏览器，会自动降级为 SVG。

## 迁移清单

- [ ] 在主页添加 Iconify CDN
- [ ] 创建图标映射表
- [ ] 替换主页模块图标
- [ ] 替换 animation 模块图标
- [ ] 替换 grid 模块图标
- [ ] 替换 svg 模块图标
- [ ] 更新 CSS 样式
- [ ] 测试所有页面
- [ ] 测试主题切换
- [ ] 测试响应式
- [ ] 更新文档

## 参考资源

- [Iconify 官网](https://iconify.design/)
- [图标搜索](https://icon-sets.iconify.design/)
- [Web Component 文档](https://iconify.design/docs/iconify-icon/)
- [图标集列表](https://icon-sets.iconify.design/)

## 示例代码

完整的实现示例请参考 `.examples/iconify-demo.html`
