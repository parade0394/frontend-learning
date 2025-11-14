export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修复 bug）
        'perf', // 性能优化
        'test', // 测试相关
        'build', // 构建系统或外部依赖变动
        'ci', // CI 配置文件和脚本变动
        'chore', // 其他不修改 src 或测试文件的变动
        'revert', // 回滚 commit
      ],
    ],
    'subject-case': [0], // 不限制 subject 大小写
  },
};
