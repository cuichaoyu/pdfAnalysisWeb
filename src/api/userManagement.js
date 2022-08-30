import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

export default {
  // 查询table
  getList(params) {
    return request({
      url: '/api/sysuser/page',
      method: 'GET',
      params
    })
  },
  // 启用禁用
  userEnableOrDisable(data) {
    return request({
      url: '/api/sysuser/updateById',
      method: 'post',
      data
    })
  },
  // 删除
  deleteHandle(id) {
    return request({
      url: '/api/sysuser/delete/' + id,
      method: 'post',
    })
  },
  // 新增
  sureSave(data) {
    return request({
      url: '/api/sysuser/save',
      method: 'post',
      data
    })
  },
}

