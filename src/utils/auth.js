// token 查 改 删

import Cookies from 'js-cookie'

const TokenKey = 'token'
const userInfo = 'userInfo'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getUser() {
  return JSON.parse(Cookies.get(userInfo))
}


export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setUser(user) {
  return Cookies.set(userInfo, user)
}


export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeUser() {
  return Cookies.remove(userInfo)
}
