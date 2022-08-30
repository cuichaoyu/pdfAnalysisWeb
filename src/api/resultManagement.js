import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

export default {
  // 查询table
  getList(params) {
    return request({
      url: '/api/businesspdffeature/page',
      method: 'GET',
      params
    })
  },
  // 同步文件
  syncFile(data) {
    return request({
      url: '/api/admin/store/',
      method: 'post',
      data
    })
  },
  // 解析文件
  parseHandle(data) {
    return request({
      url: '/api/admin/store/',
      method: 'post',
      data
    })
  },
  // 删除文件
  deleteFileHandle(id) {
    return request({
      url: '/api/businesspdffeature/delete/' + id,
      method: 'post',
    })
  },
}

