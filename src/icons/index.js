/**
 * 字体图标, 统一使用SVG Sprite矢量图标(http://www.iconfont.cn/）
 *
 * 使用阿里素材的图标志-不推荐:
 *  1. 在阿里矢量图标站创建一个项目, 并添加图标(这一步非必须, 创建方便项目图标管理)
 *  2-1. 添加icon, 选中新增的icon图标, 复制代码 -> 下载 -> SVG下载 -> 粘贴代码(重命名)  注意批量去色 在 iconfont 里面
 *  2-2. 添加icons, 下载图标库对应[iconfont.js]文件, 替换项目[./iconfont.js]文件  这一步可以省掉
 *  3. 组件模版中使用 []
 *
 * 注意:
 *  1. 通过2-2 添加icons, getNameList方法无法返回对应数据
 *
 *
 * 使用 Font Awesome  中的图标 推荐
 * 1、在 Font Awesome 找到合适的图标 例如 ad
 * 2、如下 <svg-icon :icon-class="ad" class-name="admin" />
 * 3、其中 icon-class 输入的图表名称，class-name 输入的 自定义的 class，可以利用这个 class 调整图标的样式
 *
 */

import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// 获取到所有的图表名称  在菜单设置里面使用
const re = /\.\/(.*)\.svg/
const requireAll1 = requireContext => requireContext.keys()
export const svgIcons = requireAll1(req).map(i => {
  return i.match(re)[1]
})

