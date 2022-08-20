// 设置浏览器的 title  在permission 中引用

import defaultSettings from '@/settings'

const title = defaultSettings.title

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
