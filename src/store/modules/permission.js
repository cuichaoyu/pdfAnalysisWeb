import { asyncRoutes, constantRoutes } from '@/router'
import { getSysMenuList } from '@/api/user'

/* Layout */
import Layout from '@/layout'

/**
 * 本地路由的情况  Use meta.role 检验当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 本地路由的情况 递归  过滤 路由表
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes (routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

/**
 * 添加动态(后台返回菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], prenterUrl = '') {
  menuList.forEach((el, i) => {
    // 公用
    el.meta = {
      title: el.name,
      icon: el.icon
    }
    el.name = camelCase(prenterUrl + el.url)

    // 菜单组
    if (el.type == '0') {
      el.path = el.url
      el.component = Layout
      el.alwaysShow = true
      el.redirect = 'noRedirect'
    }
    // 菜单
    if (el.type == '1') {
      el.path = prenterUrl + el.url
      // import('@/views/guide/index') 使用拼接字符的话会报错 所以使用了下面的方法  建议开发环境中还是使用 import
      el.component = (resolve) => require([`@/views${prenterUrl || ''}${el.url}`], resolve)
    }

    // 有子菜单
    if (el.list && el.list.length >= 1) {
      el.children = el.list
      fnAddDynamicMenuRoutes(el.children, el.url)
    }
  })
}

// 将 /index/name 路由的写法转换为 驼峰命名发 用着写路由的name
function camelCase(str) {
  // 转小写 。匹配所有的 /后面的字母改为大写 。 删除所有 /
  return str.toLowerCase().replace(/(?:^|\/)\w/g, function(c) {
    return c.toUpperCase().replace(/\/*/g, '')
  })
}

const state = {
  routes: [], // 全部路由 不需要权限的 + 后台强求的需要权限的
  addRoutes: [] // 后天请求的新增的需要权限的路由
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }

}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // 从后端获取路由菜单
      // getSysMenuList().then(response => {

      // const { data, code } = response

      // if (code != 200) {
      //   console.log("路由获取失败")
      //   return
      // };

      //const { data } =  getSysMenuList()
      const data = {
        'menuList': [
          {
            'menuId': 426,
            'parentId': 0,
            'parentName': null,
            'name': '解析结果管理',
            'url': '/resultManagement/index',
            'perms': '',
            'type': 1,
            'icon': 'my_course',
            'orderNum': 1,
          },
          {
            'menuId': 417,
            'parentId': 0,
            'parentName': null,
            'name': '文件管理',
            'url': '/fileManagement',
            'perms': '',
            'type': 0,
            'icon': 'my_store',
            'orderNum': 2,
            'open': null,
            'list': [
              {
                'menuId': 434,
                'parentId': 417,
                'parentName': null,
                'name': '文件管理',
                'url': '/index',
                'perms': '',
                'type': 1,
                'icon': '',
                'orderNum': 1,
                'open': null,
                'list': null
              },
              {
                'menuId': 433,
                'parentId': 417,
                'parentName': null,
                'name': '员工管理',
                'url': '/coach',
                'perms': '',
                'type': 1,
                'icon': '',
                'orderNum': 2,
                'open': null,
                'list': null
              }
            ]
          },
          {
            'menuId': 418,
            'parentId': 0,
            'parentName': null,
            'name': '会员',
            'url': '/vip',
            'perms': '',
            'type': 0,
            'icon': 'my_vip',
            'orderNum': 24,
            'open': null,
            'list': [
              {
                'menuId': 435,
                'parentId': 418,
                'parentName': null,
                'name': '会员管理',
                'url': '/vip',
                'perms': '',
                'type': 1,
                'icon': '',
                'orderNum': 0,
                'open': null,
                'list': null
              },
              {
                'menuId': 436,
                'parentId': 418,
                'parentName': null,
                'name': '会员卡',
                'url': '/vipCard',
                'perms': '',
                'type': 1,
                'icon': '',
                'orderNum': 1,
                'open': null,
                'list': null
              },
              {
                'menuId': 436,
                'parentId': 418,
                'parentName': null,
                'name': '操作审批',
                'url': '/vipCzSp',
                'perms': '',
                'type': 1,
                'icon': '',
                'orderNum': 1,
                'open': null,
                'list': null
              }
            ]
          },

        ],
        'permissions': [
          'sys:role:list',
          'sys:role:save',
          'sys:schedule:list',
          'sys:schedule:info',
          'sys:user:delete',
          'sys:sys-dept:select',
          'sys:user:list',
          'sys:role:info',
          'sys:schedule:delete',
          'sys:sys-dept:list',
          'sys:user:info',
          'sys:sys-dept:delete'
        ]
      }
      // 组装路由
      fnAddDynamicMenuRoutes(data.menuList)

      commit('SET_ROUTES', {}) // 调用mutations里面的 方法设置router
      const accessRoutes = {
       menu: data.menuList.concat(asyncRoutes),
        roles: data.permissions
      }
      resolve(accessRoutes)
      // })
    })

    // 前端模返回 路由菜单
    // return new Promise(resolve => {
    //   let accessedRoutes
    //   if (roles.includes('admin')) { //如果权限是 admin  就可以访所有路由
    //     accessedRoutes = asyncRoutes || []
    //   } else {  //如果权限不是 admin  就循环判断都有那个路由可以访问
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes) //调用mutations里面的 方法设置router
    //   resolve(accessedRoutes)
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
