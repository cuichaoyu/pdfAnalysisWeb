import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

// 登录
export function login(data) {
  return request({
    url: '/api/web/login',
    method: 'post',
    // data: QS.stringify(data)
    data
  })
}

// 请求用户信息
export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    headers:{ token }
  })
}
// 图片验证码
export function getCaptcha(params) {
  return request({
    url: '/api/captcha.jpg',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 请求 路由表
export function getSysMenuList() {
  return request({
    url: '/api/admin/users',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/admin/users',
    method: 'get'
  })
}
