# 前端学习中心 Frontend Learning Hub

一个整合的前端学习项目，包含 CSS 动画、Grid 布局和实用工具的完整教程。支持使用 Vite 本地开发与多页面构建。

## 📁 项目结构

```
frontend-learning/
├── index.html              # 主入口页面
├── src/                    # 公共资源
│   ├── styles/
│   │   └── common.css      # 公共样式（CSS变量、通用组件）
│   ├── components/         # 可复用组件
│   │   ├── BackToTop.js    # 返回顶部组件
│   │   └── ThemeSystem.js  # 主题系统组件
│   ├── utils/              # 工具函数模块
│   │   ├── animations.js   # 动画工具
│   │   ├── clipboard.js    # 剪贴板工具
│   │   ├── helpers.js      # 通用辅助函数
│   │   ├── storage.js      # 本地存储工具
│   │   └── toast.js        # 提示消息工具
│   ├── utils.js            # 工具函数入口
│   ├── theme.js            # 主题系统（亮/暗/跟随系统 + 主色定制）
│   └── theme-sync.js       # 主题同步脚本
├── animation/              # CSS 动画模块
│   ├── index.html          # 动画模块主页
│   ├── styles.css          # 动画模块专用样式
│   ├── demos/              # 32+ 个动画演示
├── grid/                   # CSS Grid 布局模块
│   ├── index.html          # Grid 模块主页
│   └── demo*.html          # 10 个 Grid 演示
├── box-shadow/             # Box-Shadow 工具模块
│   └── index.html          # 交互式阴影生成器
├── svg/                    # SVG 教程模块
│   └── demo*.html          # 10 个 SVG 演示
├── .guides/                # 项目指南文档
│   ├── code-formatting.md  # 代码格式化指南
│   └── iconify-integration.md  # 图标集成指南
├── vite.config.js          # Vite 配置（多页面构建）
├── package.json            # 项目元数据与脚本
└── dist/                   # 构建产物（由 Vite 生成）
```

## 🚀 快速开始

### ⚠️ 重要提示

**本项目使用 ES Modules，必须通过 HTTP 服务器访问，不能直接双击 HTML 文件！**

**原因**：

- ES Modules (`import/export`) 在 `file://` 协议下无法工作
- 浏览器 CORS 安全限制会阻止资源加载
- 相对路径引用可能失效

### 方式 1：使用 Vite 开发服务器（推荐）

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 方式 2：使用其他静态服务器

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js serve
npx serve

# 使用 Node.js http-server
npx http-server

# 然后在浏览器打开 http://localhost:8000
```

## 📚 学习模块

### 1. CSS 动画教程 🎬

- **内容**：Transform、Transition、Animation 完整教程
- **知识点**：32+ 个核心概念
- **演示**：120+ 个交互式示例
- **时长**：4-6 小时
- **入口**：`animation/index.html`

**包含内容**：

- 基础概念（坐标系统）
- Transform 变换（平移、旋转、缩放、倾斜）
- Transition 过渡
- Animation 动画
- 3D 变换
- 高级属性
- 实际应用示例

### 2. CSS Grid 布局 📐

- **内容**：从基础到高级的 Grid 布局教程
- **知识点**：10 个核心示例
- **特点**：实战导向
- **时长**：2-3 小时
- **入口**：`grid/index.html`

**包含内容**：

- 基础网格
- 列和行定义
- 网格间距
- 网格区域
- 跨越单元格
- 自动填充
- 弹性尺寸
- 对齐方式
- 模板区域
- 响应式布局

### 3. SVG 图形教程 🎨

- **内容**：SVG 基础到高级应用
- **知识点**：10 个核心演示
- **特点**：交互式学习
- **时长**：2-3 小时
- **入口**：`svg/` 目录下的各个演示

**包含内容**：

- 基础形状
- 路径绘制
- 渐变填充
- 变换操作
- 文本处理
- 滤镜效果
- 动画效果
- 图标系统
- 交互图表
- 响应式 SVG

### 4. Box-Shadow 工具 💡

- **内容**：交互式阴影生成器
- **特点**：可视化调试、实时预览
- **功能**：多层阴影、光源控制
- **入口**：`box-shadow/index.html`

## 🎨 设计特点

### 统一的设计系统

- **CSS 变量**：统一的颜色、间距、字体系统
- **组件复用**：按钮、卡片、代码块等通用组件
- **响应式**：完美适配桌面和移动端
- **现代化**：清新的绿色主题，专业的 UI 设计

### 主题系统（已实现）

- **模式**：亮色、暗色、跟随系统自动切换
- **主色定制**：预设多种主题色，实时应用并持久化
- **可访问性**：ARIA 属性与键盘可达性完善
- **入口**：在页面中引入 `src/theme.js`

### 公共资源

所有模块共享以下资源：

- `src/styles/common.css`：基础样式、CSS 变量、通用组件
- `src/components/`：可复用组件（返回顶部、主题系统等）
- `src/utils/`：模块化工具函数（动画、剪贴板、存储、提示等）
- `src/utils.js`：工具函数统一入口
- `src/theme.js`：主题工具栏与面板（暗色模式与主题色）
- `src/theme-sync.js`：主题同步脚本

## 🛠️ 技术栈

- **HTML5**：语义化结构
- **CSS3**：Transform、Transition、Animation、Grid、Flexbox、CSS Variables
- **Vanilla JavaScript**：无依赖框架，纯原生 JS，模块化组织
- **响应式设计**：移动端优先
- **Vite 5**：本地开发与多页面构建
- **代码格式化**：Prettier + ESLint + Stylelint 统一代码风格
- **Git 工作流**：Husky + lint-staged + Commitizen + commitlint

### 多页面构建说明

- 通过 `vite.config.js` 的 `rollupOptions.input` 配置多入口
- 主要页面：`index.html`、`animation/index.html`、`grid/index.html`、`box-shadow/index.html`
- SVG 模块包含 10 个独立演示页面
- 构建后在 `dist/` 生成对应页面与资源，适合静态托管

## 📊 项目统计

- **总模块数**：4 个（动画、Grid、SVG、Box-Shadow）
- **知识点**：52+ 个
- **交互演示**：130+ 个
- **代码行数**：10,000+ 行
- **文件数量**：60+ 个

## 🎯 适用人群

- ✅ 前端开发初学者
- ✅ 想系统学习 CSS 的开发者
- ✅ UI/UX 设计师
- ✅ 前端培训讲师
- ✅ 技术博主

## 🔧 扩展性

### 添加新模块

1. 创建新模块目录和入口页面
2. 引入 `src/styles/common.css` 作为基础样式
3. 使用 `src/utils.js` 中的工具函数
4. 使用 `src/components/` 中的可复用组件
5. 在 `index.html` 中添加模块入口
6. 在 `vite.config.js` 中添加构建入口（如需要）

### 自定义样式

- 修改 `src/styles/common.css` 中的 CSS 变量
- 每个模块可以有自己的独立样式文件
- 使用模块化的组件和工具函数

## 📝 开发规范

### 代码格式化

项目使用现代化的代码格式化工具：

```bash
# 格式化所有文件
npm run format

# 修复所有问题（推荐）
npm run lint:fix

# 单独检查
npm run lint:js      # JavaScript
npm run lint:css     # CSS
```

详细文档：[.guides/code-formatting.md](.guides/code-formatting.md)

### Git 钩子与提交规范

项目集成了完整的 Git 工作流工具：

**Husky + lint-staged**：提交前自动格式化和检查代码
**commitlint**：验证提交信息格式
**Commitizen**：交互式生成标准化提交信息

```bash
# 方式 1：使用 Commitizen（推荐）
git add .
npm run commit  # 交互式提示，自动生成规范的 commit message

# 方式 2：手动提交
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复 bug"
```

详细文档：[COMMITIZEN_INTEGRATION_COMPLETE.md](COMMITIZEN_INTEGRATION_COMPLETE.md)

### CSS 规范

- 使用 CSS 变量（`var(--primary)`）
- 遵循 BEM 命名规范
- 移动端优先的响应式设计
- 自动格式化和 lint 检查

### JavaScript 规范

- 使用 ES6+ 语法
- 函数式编程优先
- 详细的注释说明
- ESLint 自动检查和修复

### 文件组织

- 公共资源放在 `src/` 目录
- 组件和工具函数模块化组织
- 模块独立，互不依赖
- 保持文件结构清晰

## 🚧 未来计划

- [ ] 添加 Flexbox 布局模块
- [ ] 添加响应式设计模块
- [ ] 完善 SVG 模块的主入口页面
- [ ] 添加学习进度追踪
- [ ] 添加代码复制与示例分享功能
- [ ] 添加搜索功能
- [ ] 增强动画示例的可访问性
- [ ] 集成图标系统（Iconify）

## 📄 许可

MIT License

## 📦 构建和部署

### 构建

```bash
npm run build    # 构建项目
npm run verify   # 验证构建结果
```

### 本地预览

```bash
npm run preview  # 使用 Vite 预览

# 或使用 serve
npx serve dist

# 或使用 Python
cd dist && python -m http.server 8000
```

**注意**：请使用 HTTP 服务器访问，不要直接双击 HTML 文件。

### 部署

```bash
# Vercel（推荐）
vercel --prod

# Netlify
netlify deploy --prod

# 或将 dist/ 目录上传到任意静态服务器
```

---

**项目状态**：✅ 基础版本完成（支持 Vite 多页面构建）
**最后更新**：2025-11-14

## 💡 使用提示

1. **从简单到复杂**：建议按照模块顺序学习
2. **动手实践**：每个示例都可以交互，多尝试不同参数
3. **查看源码**：右键查看页面源代码，学习实现方式
4. **移动端体验**：在手机上也能完美使用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！
