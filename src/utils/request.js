// 封装 axicos 请求
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置请求ip url = base url + request url 自动加载 url的前面
  // withCredentials: true, // 当跨域请求发送cookie
  timeout: 6000 // 请求超时
})
// 设置 post、put 默认 Content-Type  请求头
service.defaults.headers.post['Content-Type'] = 'application/json'
// service.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// service.defaults.headers.put["Content-Type"] = "application/json";

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么

    if (store.getters.token) {
      // 让每个请求携带token
      // ['X-Token']是一个自定义的headers键
      // 根据实际情况修改
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   *如果你想获取http信息，例如头或状态
   * 请 return  response => response
  */

  /**
   *通过自定义代码确定请求状态
    这里只是一个例子
   *也可以通过HTTP状态码判断状态
   */
  response => {
   // console.log('请求返回', response)
    return response ;
  },
  error => {
    if (error.response.status == 401) {
      Message({
        message: error.response.data.message || '您已经登出，需要重新登录!',
        type: 'error',
        duration: 3 * 1000,
        onClose :function(){
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }
      })
    } else {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return error.response ;
  }
)

export default service
