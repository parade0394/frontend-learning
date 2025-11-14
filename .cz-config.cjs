module.exports = {
  types: [
    { value: 'feat', name: 'feat:     ✨ 新功能' },
    { value: 'fix', name: 'fix:      🐛 修复 Bug' },
    { value: 'docs', name: 'docs:     📝 文档更新' },
    { value: 'style', name: 'style:    💄 代码格式（不影响功能）' },
    { value: 'refactor', name: 'refactor: ♻️  重构（既不是新增功能，也不是修复 Bug）' },
    { value: 'perf', name: 'perf:     ⚡️ 性能优化' },
    { value: 'test', name: 'test:     ✅ 测试相关' },
    { value: 'build', name: 'build:    📦️ 构建系统或外部依赖变动' },
    { value: 'ci', name: 'ci:       🎡 CI 配置文件和脚本变动' },
    { value: 'chore', name: 'chore:    🔧 其他不修改 src 或测试文件的变动' },
    { value: 'revert', name: 'revert:   ⏪️ 回滚 commit' },
  ],

  scopes: [
    { name: 'animation' },
    { name: 'grid' },
    { name: 'box-shadow' },
    { name: 'theme' },
    { name: 'shared' },
    { name: 'docs' },
    { name: 'config' },
    { name: 'deps' },
  ],

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'footer'],

  messages: {
    type: '选择你要提交的类型：',
    scope: '选择一个 scope（可选）：',
    customScope: '请输入自定义的 scope：',
    subject: '填写简短精炼的变更描述：\n',
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: '列举非兼容性重大的变更（可选）：\n',
    footer: '列举出所有变更的 ISSUES CLOSED（可选）。例如：#31, #34：\n',
    confirmCommit: '确认提交？',
  },

  subjectLimit: 100,
};
