import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

export default {
  // 门店管理-查询table
  getStoreList(params,urlParams) {
    if (typeof (urlParams) == 'undefined' || urlParams == null) {
      urlParams = '' ;
    }
    return request({
      url: `/api/admin/store/${urlParams}`,
      method: 'GET',
      params
    })
  },
  // 查询会员卡审批列表
  getVipCardOperatesList: (params) => {
    return request({
      url: `/api/admin/cards/operates/list`,
      method: 'GET',
      params
    })
  },
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
  deleteFileHandle(data) {
    return request({
      url: '/api/admin/store/',
      method: 'post',
      data
    })
  },
}

