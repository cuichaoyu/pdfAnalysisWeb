import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings, // 右侧的靠边设置按钮显示状态 初始化在  @/settings 里面
  tagsView: tagsView, // 面包屑导航 显示状态
  fixedHeader: fixedHeader, // 修复头部状态
  sidebarLogo: sidebarLogo // 显示 logo 转改
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins hasOwnProperty 方法用来判断 自身 及继承的有没有 这个属性
    if (state.hasOwnProperty(key)) {
      state[key] = value
      //  store刷新后数据会重载 所以用localStorage保存在本地
      localStorage.setItem(key, JSON.stringify(state[key]))

      // console.log(">>>>>>>>>>theme")
      // console.log(state[key])
      // console.log(variables.theme)
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

// 防止页面刷新vuex中的数据丢失  把储存到本地  的  给到  state
for (const item in state) {
  if (localStorage.getItem(item)) {
    state[item] = JSON.parse(localStorage.getItem(item))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

