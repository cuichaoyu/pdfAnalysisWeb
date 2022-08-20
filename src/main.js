import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // 基础的 的css 样式

import Element from 'element-ui'
import './styles/element-variables.scss' // 修改覆盖主题样式  包含了element 的基础样式
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css  包含修改element  元素样式的内容

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters


Vue.use(Element, {
  //size: Cookies.get('size') || 'medium' // 设置 element-ui 元素的 大小
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;
// 取消Vue所有的日志和警告
Vue.config.silent = true;


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
