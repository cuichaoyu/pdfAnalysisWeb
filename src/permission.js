import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条 bar
import 'nprogress/nprogress.css' // 进度条 style
import { getToken, getUser } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // 进度条是否显示 环形动画

const whiteList = ['/login', '/auth-redirect'] // 路由 白名单

// 导航守卫 拦截路由
router.beforeEach(async(to, from, next) => {
  // 打开进度条
  NProgress.start()

  // 设置页面 title
  document.title = getPageTitle(to.meta.title)

  // 获取token  确认用户是否已经登录
  const hasToken = getToken()
  // 1、如果已经登录
  if (hasToken) {
    if (to.path === '/login') { // 如果已登录，则重定向到主页
      // /2、就调转到主页
      next({ path: '/' })
      NProgress.done() // 关闭进度条 hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 通过getInfo判断用户是否获得了权限角色数据
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 如果获取到了 就直接跳转
      if (hasRoles) {
        next()
        // 没有获取到的话 就获取路由
      } else {
        try {
          // 本地路由时根据角色生成可访问路由图
          // 后台请求路由表 并组装路由
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          // 没有获取到 就 获取用户角色
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          // 路由修改为从后获取 所以面两条没有用
          const { roleIdList } = await store.dispatch('user/getInfo', accessRoutes.roles)
          // 动态添加可访问路由
          router.addRoutes(accessRoutes.menu)

          // 黑客方法，以确保地址路由是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌，然后转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error({
            message: error || '出现错误，请稍后再试'
          })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 路由跳转完成进度条
  NProgress.done()
})
