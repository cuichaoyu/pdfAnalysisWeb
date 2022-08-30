import { login, logout, getInfo } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  setUser, removeUser, getUser
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { pictureDomain } from '@/utils/dictionaries'

const state = {
  token: getToken(),
  introduction: '',
  roles: [],
  user:{},
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  // 用户登录
  login({ commit }, loginInfo) {
    return new Promise((resolve, reject) => {
      login(loginInfo).then(res => {
        if (res.code == 200){
          commit('SET_TOKEN', res.data.token);
          let user = {};
          commit('SET_USER', user )
          setToken(res.data.token)
          setUser(user);
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }, roles) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录.')
        }
        // const { roleIdList, username, avatar, introduction } = data
        const { username } = data // 暂时项目中没有后期加上

        // roles必须是非空数组 正式项目中是在请求路由的时候返回的 所以这里使用传进来的
        // if (!roles || roles.length <= 0) {
        //   reject('角色必须是一个非空数组!')
        // }
        commit('SET_ROLES', roles || ['admin'])
        //commit('SET_USER', username)
        // commit('SET_AVATAR', avatar)  //暂时项目中没有后期加上
        // commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user 退出登录
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USER', {})
      removeToken()
      resetRouter()
      removeUser()

      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USER', {})
      removeToken()
      removeUser()
      resolve()
    })
  },

  // 动态地修改权限
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // 根据角色生成可访问路由图
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // 动态添加可访问路由
    router.addRoutes(accessRoutes)

    // 重置访问的视图和缓存的视图
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
