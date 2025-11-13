/**
 * 本地存储工具 - 带完整错误处理
 */

export const storage = {
  /**
   * 存储数据
   * @param {string} key - 键名
   * @param {*} value - 值（会自动JSON序列化）
   * @returns {boolean} 是否成功
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`存储失败 (${key}):`, err.message);
      return false;
    }
  },

  /**
   * 读取数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的值或默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (err) {
      console.warn(`读取失败 (${key}):`, err.message);
      return defaultValue;
    }
  },

  /**
   * 删除数据
   * @param {string} key - 键名
   * @returns {boolean} 是否成功
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`删除失败 (${key}):`, err.message);
      return false;
    }
  },

  /**
   * 清空所有数据
   * @returns {boolean} 是否成功
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.warn('清空失败:', err.message);
      return false;
    }
  },
};
