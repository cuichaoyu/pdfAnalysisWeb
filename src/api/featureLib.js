import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

export default {
  // 查询table
  getList(params,urlParams) {
    if (typeof (urlParams) == 'undefined' || urlParams == null) {
      urlParams = '' ;
    }
    return request({
      url: `/api/admin/store/${urlParams}`,
      method: 'GET',
      params
    })
  },
  // 删除
  deleteHandle(data) {
    return request({
      url: '/api/admin/store/',
      method: 'post',
      data
    })
  },
  // 新增
  sureSave(data) {
    return request({
      url: '/api/admin/store/',
      method: 'post',
      data
    })
  },
}

