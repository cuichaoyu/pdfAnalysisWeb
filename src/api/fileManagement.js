import request from '@/utils/request'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs'

export default {
  // 查询table
  getList(params) {
    return request({
      url: '/api/businesspdf/page',
      method: 'GET',
      params
    })
  },
  // 同步文件
  syncFile() {
    return request({
      url: '/api//businesspdf/sync',
      method: 'get',
    })
  },
  // 解析文件
  parseHandle(id) {
    return request({
      url: '/api/businesspdf/parse/' + id ,
      method: 'post',
    })
  },
  // 新增
  sureImportFile(data) {
    return request({
      url: '/api/businesspdf/save',
      method: 'post',
      data
    })
  },
  // 删除文件
  deleteFileHandle(id) {
    return request({
      url: '/api/businesspdf/delete/' + id,
      method: 'post',
    })
  },



//----------------------------解析文件接口-----------------
  // 查询解析文件table
  getParseFileList(params) {
    return request({
      url: '/api/businesspdffeature/page',
      method: 'GET',
      params
    })
  },
  // 新增
  addParseFile(data) {
    return request({
      url: '/api/businesspdffeature/save',
      method: 'post',
      data
    })
  },
  // 删除文件
  deleteParseHandle(id) {
    return request({
      url: '/api/businesspdffeature/delete/' + id,
      method: 'post',
    })
  },
  // 确认
  sureParseHandle(id) {
    return request({
      url: '/api/businesspdffeature/pass/' + id,
      method: 'post',
    })
  },
  // 批量确认
  sureParseBatchHandle(data) {
    return request({
      url: '/api/businesspdffeature/batchPass',
      method: 'post',
      data
    })
  },
  // 根据ID编辑
  updateByIDHandle(data) {
    return request({
      url: '/api/businesspdffeature/updateById',
      method: 'post',
      data
    })
  },
  // 查询单个
  getInfoHandle(id) {
    return request({
      url: '/api/businesspdffeature/info/' + id,
      method: 'get',
    })
  },
}

