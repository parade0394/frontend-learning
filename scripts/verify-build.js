/**
 * 构建验证脚本
 * 检查构建产物是否完整
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

console.log('🔍 验证构建结果...\n');

let hasError = false;

// 1. 检查 dist 目录是否存在
if (!fs.existsSync(distDir)) {
  console.error('❌ dist 目录不存在！请先运行 npm run build');
  process.exit(1);
}

console.log('✅ dist 目录存在');

// 2. 检查主要 HTML 文件
const htmlFiles = ['index.html', 'animation/index.html', 'grid/index.html', 'svg/index.html', 'box-shadow/index.html'];

console.log('\n📄 检查 HTML 文件:');
htmlFiles.forEach((file) => {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    console.log(`  ✅ ${file} (${(size / 1024).toFixed(2)} KB)`);
  } else {
    console.error(`  ❌ ${file} 不存在`);
    hasError = true;
  }
});

// 3. 检查 shared JS 文件
const jsFiles = ['theme.js', 'theme-sync.js', 'utils.js', 'theme-utils.js'];

console.log('\n📦 检查 JS 文件:');
jsFiles.forEach((file) => {
  const filePath = path.join(distDir, 'shared', file);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    console.log(`  ✅ shared/${file} (${(size / 1024).toFixed(2)} KB)`);
  } else {
    console.error(`  ❌ shared/${file} 不存在`);
    hasError = true;
  }
});

// 4. 检查 CSS 文件
console.log('\n🎨 检查 CSS 文件:');
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const cssFiles = fs.readdirSync(assetsDir, { recursive: true }).filter((file) => file.endsWith('.css'));

  if (cssFiles.length > 0) {
    console.log(`  ✅ 找到 ${cssFiles.length} 个 CSS 文件`);
    cssFiles.slice(0, 3).forEach((file) => {
      const filePath = path.join(assetsDir, file);
      const size = fs.statSync(filePath).size;
      console.log(`     - ${file} (${(size / 1024).toFixed(2)} KB)`);
    });
    if (cssFiles.length > 3) {
      console.log(`     ... 还有 ${cssFiles.length - 3} 个文件`);
    }
  } else {
    console.error('  ❌ 没有找到 CSS 文件');
    hasError = true;
  }
} else {
  console.error('  ❌ assets 目录不存在');
  hasError = true;
}

// 5. 统计总文件数和大小
console.log('\n📊 构建统计:');
function getDirectoryStats(dir) {
  let fileCount = 0;
  let totalSize = 0;

  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        traverse(filePath);
      } else {
        fileCount++;
        totalSize += stat.size;
      }
    });
  }

  traverse(dir);
  return { fileCount, totalSize };
}

const stats = getDirectoryStats(distDir);
console.log(`  📁 总文件数: ${stats.fileCount}`);
console.log(`  💾 总大小: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`  📦 压缩后约: ${(stats.totalSize / 1024 / 1024 / 3).toFixed(2)} MB (gzip)`);

// 6. 最终结果
console.log('\n' + '='.repeat(50));
if (hasError) {
  console.error('❌ 构建验证失败！请检查上述错误。');
  process.exit(1);
} else {
  console.log('✅ 构建验证通过！所有文件都已正确生成。');
  console.log('\n💡 提示:');
  console.log('  - 运行 npm run preview 预览');
  console.log('  - 或直接打开 dist/index.html');
  console.log('  - 查看 DEPLOYMENT.md 了解部署方式');
}
