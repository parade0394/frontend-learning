/**
 * 批量更新 Animation Demo 文件
 *
 * 功能：
 * 1. 在所有 demo 文件中添加 utils.js 引用
 * 2. 可选：替换重复的动画代码为工具函数调用
 *
 * 使用方法：
 * node scripts/batch-update-demos.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const DEMOS_DIR = path.join(__dirname, '../animation/demos');
const DRY_RUN = false; // 设置为 false 才会真正修改文件

// 需要更新的文件列表（排除已更新的）
const demoFiles = [
  'animation-play-state.html',
  'backface-visibility.html',
  'coordinate.html',
  'delay.html',
  'duration.html',
  'fill-mode-demo.html',
  'keyframes.html',
  'multiple.html',
  'overview.html',
  'perspective-origin.html',
  'perspective.html',
  'rotate.html',
  'rotate3d.html',
  'rotateX.html',
  'rotateY.html',
  'rotateZ.html',
  'scale.html',
  'scaleX.html',
  'scaleY.html',
  'scaleZ.html',
  'skew.html',
  'skewX.html',
  'skewY.html',
  'timing.html',
  'transform-origin.html',
  'transform-style.html',
  // 'translate.html', // 已更新，跳过
  'translate3d.html',
  'translateX.html',
  'translateY.html',
  'translateZ.html',
  'will-change.html',
];

/**
 * 更新单个文件
 */
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. 检查是否已经有 utils.js 引用
    if (!content.includes('shared/utils.js')) {
      // 在 </head> 之前添加 script 标签
      const headCloseTag = '</head>';
      const scriptTag = '    <script src="../../shared/utils.js"></script>\n  ';

      if (content.includes(headCloseTag)) {
        content = content.replace(headCloseTag, scriptTag + headCloseTag);
        modified = true;
        console.log(`✅ 添加 utils.js 引用: ${path.basename(filePath)}`);
      }
    } else {
      console.log(`⏭️  已有 utils.js 引用: ${path.basename(filePath)}`);
    }

    // 2. 可选：替换常见的动画代码模式
    // 这里只是示例，实际使用时需要根据具体情况调整
    const oldPattern = /box\.classList\.remove\('animate-\w+'\);\s*box\.offsetHeight;\s*box\.classList\.add\('animate-\w+'\);/g;
    if (oldPattern.test(content)) {
      // 这里可以添加替换逻辑
      // content = content.replace(oldPattern, 'playAnimation(box, ...)');
      console.log(`💡 发现可优化的动画代码: ${path.basename(filePath)}`);
    }

    // 3. 写入文件（仅在非 DRY_RUN 模式）
    if (modified && !DRY_RUN) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`💾 文件已更新: ${path.basename(filePath)}`);
    }

    return modified;
  } catch (error) {
    console.error(`❌ 处理文件失败: ${path.basename(filePath)}`, error.message);
    return false;
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始批量更新 Animation Demo 文件...\n');
  console.log(`📁 目录: ${DEMOS_DIR}`);
  console.log(`📝 模式: ${DRY_RUN ? 'DRY RUN（预览模式，不会修改文件）' : '实际修改模式'}\n`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  demoFiles.forEach((fileName) => {
    const filePath = path.join(DEMOS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${fileName}`);
      errorCount++;
      return;
    }

    const result = updateFile(filePath);
    if (result) {
      updatedCount++;
    } else {
      skippedCount++;
    }
  });

  console.log('\n📊 统计结果:');
  console.log(`   ✅ 需要更新: ${updatedCount} 个文件`);
  console.log(`   ⏭️  已是最新: ${skippedCount} 个文件`);
  console.log(`   ❌ 处理失败: ${errorCount} 个文件`);
  console.log(`   📝 总计: ${demoFiles.length} 个文件`);

  if (DRY_RUN && updatedCount > 0) {
    console.log('\n💡 提示: 这是预览模式，没有实际修改文件');
    console.log('   如需真正更新，请将脚本中的 DRY_RUN 设置为 false');
  }

  console.log('\n✨ 批量更新完成！');
}

// 运行
main();
