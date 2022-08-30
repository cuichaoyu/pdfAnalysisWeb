import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

export default {
  // 查询table
  getList(params) {
    return request({
      url: '/api/businessfeature/page',
      method: 'GET',
      params
    })
  },

  // 查询效应关键字字典
  getEffectKeysList(params){
    return request({
      url: '/api/sysdict/list',
      method: 'get',
      params
    })
  },
  // 删除
  deleteHandle(id) {
    return request({
      url: '/api/businessfeature/delete/' + id,
      method: 'post',
    })
  },
  // 新增
  sureSave(data) {
    return request({
      url: '/api/businessfeature/save',
      method: 'post',
      data
    })
  },
}

