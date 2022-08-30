import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

export default {
  // 查询字典
  getDictionariesList(params){
    return request({
      url: '/api/sysdict/list',
      method: 'get',
      params
    })
  },

}

