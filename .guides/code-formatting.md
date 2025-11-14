# 代码格式化完整指南

本项目使用现代化的代码格式化工具来保持代码风格统一。

## ✅ 已安装的工具

### 1. Prettier - 代码格式化器

- **版本**：最新
- **支持**：HTML, CSS, JavaScript, JSON, Markdown
- **配置文件**：`.prettierrc.json`
- **特性**：
  - 自动格式化代码
  - 自动组织 HTML 属性顺序
  - 统一代码风格
  - 保存时自动格式化

### 2. ESLint - JavaScript 代码质量

- **版本**：9.x（最新，使用新配置格式）
- **配置文件**：`eslint.config.js`
- **支持**：`.js` 文件 + HTML 文件中的 `<script>` 标签
- **插件**：eslint-plugin-html（检查 HTML 中的 JS）
- **核心规则**：
  - **未使用变量/函数：error 级别**（防止功能未实现）
  - 强制使用 `const`/`let`，禁止 `var`
  - 强制使用严格相等 `===`
  - 强制使用大括号
  - 推荐使用单引号
  - 允许 `_param` 这样的未使用参数（以 `_` 开头）

### 3. Stylelint - CSS 代码质量

- **版本**：最新
- **配置文件**：`.stylelintrc.json`
- **基于**：stylelint-config-standard
- **特性**：支持现代 CSS 特性和自定义属性

### 4. EditorConfig - 编辑器配置

- **配置文件**：`.editorconfig`
- **功能**：统一缩进、换行符、编码等基础配置

## 📦 安装的依赖

```json
{
  "devDependencies": {
    "prettier": "latest",
    "prettier-plugin-organize-attributes": "latest",
    "eslint": "latest",
    "@eslint/js": "latest",
    "globals": "latest",
    "eslint-plugin-html": "latest",
    "stylelint": "latest",
    "stylelint-config-standard": "latest",
    "postcss-html": "latest"
  }
}
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. VS Code 用户（推荐）

#### 安装推荐扩展

打开项目时会自动提示安装，或手动安装：

1. **Prettier - Code formatter** (esbenp.prettier-vscode)
2. **ESLint** (dbaeumer.vscode-eslint)
3. **Stylelint** (stylelint.vscode-stylelint)
4. **EditorConfig** (editorconfig.editorconfig)

#### 自动功能

安装扩展后，自动启用：

- ✅ 保存时自动格式化
- ✅ 保存时自动修复 ESLint 问题
- ✅ 保存时自动修复 Stylelint 问题
- ✅ 实时错误提示

### 3. 命令行使用

#### 🎯 可用命令

```bash
# 格式化
npm run format              # 格式化所有文件
npm run format:check        # 检查格式（不修改）

# JavaScript（包括 HTML 中的 <script>）
npm run lint:js             # 检查 JS
npm run lint:js:fix         # 修复 JS

# CSS
npm run lint:css            # 检查 CSS
npm run lint:css:fix        # 修复 CSS

# 全部
npm run lint                # 检查所有
npm run lint:fix            # 修复所有（推荐）
```

#### 常用场景

```bash
# 提交前检查并修复所有问题
npm run lint:fix

# 只检查不修复
npm run lint

# 格式化单个文件
npx prettier --write path/to/file.html

# 检查单个文件
npm run lint:js -- "animation/demos/demo.html"
```

## 📋 配置详解

### Prettier 配置 (`.prettierrc.json`)

```json
{
  "printWidth": 100, // 每行最大宽度（HTML 120）
  "tabWidth": 2, // 缩进：2 空格
  "useTabs": false, // 使用空格而非 Tab
  "semi": true, // 使用分号
  "singleQuote": true, // 使用单引号（JavaScript）
  "trailingComma": "es5", // 尾随逗号
  "endOfLine": "lf", // LF 换行符
  "plugins": ["prettier-plugin-organize-attributes"] // HTML 属性自动排序
}
```

### ESLint 配置 (`eslint.config.js`)

**核心特性**：

- ✅ ES2022+ 语法支持
- ✅ 浏览器和 Node.js 环境
- ✅ **支持 HTML 文件**：通过 eslint-plugin-html 检查 `<script>` 标签
- ✅ 推荐规则集 + 自定义规则

**关键规则**：

```javascript
{
  'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],  // ⚠️ error 级别
  'no-var': 'error',           // 禁止 var
  'prefer-const': 'warn',      // 推荐 const
  'eqeqeq': ['error', 'always'],  // 强制 ===
  'curly': ['error', 'all'],   // 强制大括号
  'quotes': ['warn', 'single'], // 推荐单引号
  'semi': ['error', 'always']  // 强制分号
}
```

### Stylelint 配置 (`.stylelintrc.json`)

```json
{
  "extends": "stylelint-config-standard",
  "ignoreFiles": ["node_modules/**", "dist/**"],
  "rules": {
    "selector-class-pattern": null, // 允许自定义类名
    "custom-property-pattern": null, // 允许自定义 CSS 变量
    "color-function-notation": "legacy" // 支持 rgba() 等
  }
}
```

### EditorConfig (`.editorconfig`)

```ini
[*]
charset = utf-8              # UTF-8 编码
end_of_line = lf             # LF 换行符
insert_final_newline = true  # 文件末尾插入空行
trim_trailing_whitespace = true  # 删除行尾空格
indent_style = space         # 使用空格
indent_size = 2              # 2 空格缩进
```

### VS Code 配置 (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
  }
}
```

## 代码风格示例

### HTML

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>页面标题</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="container">
      <h1>标题</h1>
      <p>内容</p>
    </div>
  </body>
</html>
```

### CSS

```css
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.card {
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  transition: var(--transition-base);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### JavaScript

```javascript
// 使用 const/let
const element = document.querySelector('.container');
let count = 0;

// 使用箭头函数
const handleClick = (event) => {
  event.preventDefault();
  count++;
  updateUI();
};

// 使用模板字符串
const message = `当前计数: ${count}`;

// 使用解构赋值
const { width, height } = element.getBoundingClientRect();

// 使用可选链
const value = element?.dataset?.value ?? 'default';
```

## ✨ 使用建议

### 日常开发

1. **安装 VS Code 推荐扩展**（一次性设置）
2. **保存文件时自动格式化**（无需手动操作）
3. **提交前运行** `npm run lint:fix`

### 团队协作

1. 所有成员使用相同配置
2. 提交前检查代码格式
3. CI/CD 集成格式检查

### 最佳实践

- ✅ 不要手动格式化代码，让工具处理
- ✅ 遇到格式问题先运行 `npm run lint:fix`
- ✅ 特殊情况使用 `// prettier-ignore` 注释
- ✅ 未使用的参数用 `_` 开头（如 `_event`）

## ❓ 常见问题

### Q1: 为什么我的文件没有自动格式化？

**检查清单**：

1. ✅ 已安装 VS Code 推荐的扩展？
2. ✅ `.prettierrc.json` 配置文件存在？
3. ✅ 文件类型在配置中被支持？
4. ✅ VS Code 设置中启用了 `formatOnSave`？

### Q2: 如何临时禁用格式化？

**JavaScript**：

```javascript
// prettier-ignore
const matrix = [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
];

// eslint-disable-next-line no-unused-vars
const unused = 'temporary';
```

**CSS**：

```css
/* stylelint-disable */
.special {
  color: red !important;
}
/* stylelint-enable */
```

### Q3: 如何格式化单个文件？

```bash
# Prettier 格式化
npx prettier --write path/to/file.html

# ESLint 检查
npm run lint:js -- "path/to/file.html"

# ESLint 修复
npx eslint --fix path/to/file.js
```

### Q4: 为什么未使用的变量是 error 而不是 warning？

未使用的变量/函数通常意味着：

- ❌ 功能未实现（如空函数）
- ❌ 代码错误（如变量名拼写错误）
- ❌ 技术债务（如遗留代码）

这些是严重问题，应该立即修复。如果确实不需要使用参数，请用 `_` 开头：

```javascript
// ❌ 错误：param 未使用
const handler = (param) => {
  console.log('clicked');
};

// ✅ 正确：使用 _ 前缀
const handler = (_param) => {
  console.log('clicked');
};
```

### Q5: ESLint 检查 HTML 文件吗？

是的！通过 `eslint-plugin-html` 插件，ESLint 会检查 HTML 文件中 `<script>` 标签内的 JavaScript 代码。

```bash
# 会检查 HTML 中的 JavaScript
npm run lint:js
```

## 🔧 提交前检查

**推荐工作流**：

```bash
# 1. 修复所有问题
npm run lint:fix

# 2. 检查是否还有错误
npm run lint

# 3. 提交代码
git add .
git commit -m "your message"
```

## 🎣 Git Hooks 集成（可选）

自动在提交前检查代码：

### 安装

```bash
npm install -D husky lint-staged
npx husky init
```

### 配置 `package.json`

```json
{
  "lint-staged": {
    "*.{html,css,js,json,md}": "prettier --write",
    "*.{js,html}": "eslint --fix",
    "*.css": "stylelint --fix"
  }
}
```

### 配置 `.husky/pre-commit`

```bash
npx lint-staged
```

现在每次 `git commit` 时会自动格式化和检查代码！
