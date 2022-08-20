import store from '@/store'

/**
 * 检查是否有权限  当无法使用 指令检查 权限的时候 就要用这个进行判断
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`需要的角色! 如 v-permission="['admin','editor']"`)
    return false
  }
}
