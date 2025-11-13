/**
 * 将 Grid Demo 页面的返回链接移到左上角
 * 并使用统一的样式
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gridDir = path.resolve(__dirname, '../grid');

// 获取所有 demo HTML 文件
const demoFiles = fs.readdirSync(gridDir).filter((file) => file.startsWith('demo') && file.endsWith('.html'));

console.log(`找到 ${demoFiles.length} 个 Grid Demo 文件\n`);

demoFiles.forEach((file) => {
  const filePath = path.join(gridDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  console.log(`🔄 处理 ${file}...`);

  // 1. 移除旧的 back-link 样式定义（如果存在）
  content = content.replace(/\.back-link\s*\{[^}]*\}\s*\.back-link:hover\s*\{[^}]*\}/gs, '');

  // 2. 找到并移除底部的返回链接
  const backLinkMatch = content.match(/<a href="index\.html" class="back-link"[^>]*>.*?<\/a>/);
  if (backLinkMatch) {
    content = content.replace(backLinkMatch[0], '');
  }

  // 3. 在 <div class="container"> 后立即添加返回链接
  content = content.replace(
    /<div class="container">/,
    `<div class="container">
        <a href="index.html" class="back-link">← 返回 Grid 教程</a>
        `
  );

  // 4. 清理多余的空行
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  // 写回文件
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${file} 完成`);
});

console.log(`\n🎉 所有文件更新完成！`);
console.log(`\n💡 提示：返回链接已移到左上角，使用统一的 .back-link 样式`);
