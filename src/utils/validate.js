/**
 * 用于一些正则验证
 */

/**
 *
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证用户名是否合规
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return true
}
/* 用户名*/
// 以英文字母开头，只能包含英文字母、数字、下划线
export function validatUserName (str) {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
  return reg.test(str)
}

/**
 * 验证 URL
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL (url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 验证小写
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 验证大写
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 验证字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 验证邮箱
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail (email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function validatPhone (str) {
  const reg = /^1(3[0-9]|5[189]|8[6789])[0-9]{8}$/
  return reg.test(str)
}

/* 身份证号*/
export function validatContactID (str) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}

/**
 * 验证字符串
 * @param {string} str
 * @returns {Boolean}
 */
export function isString (str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * 验证数组
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
