module.exports = {
  title: '后台管理系统',

  /**
   * @type {boolean} true | false
   * @description 是否显示右侧面板
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否需要标签视图
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 固定右侧头部
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
