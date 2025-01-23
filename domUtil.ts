/*
 * @Description: dom 工具类
 * @Version: 1.0
 */
import { RouteLocationNormalized } from 'vue-router'
import config from '@/config/defaultSettings'

export const setDocumentTitle = function (to: RouteLocationNormalized) {
  const title: string = to?.meta?.title as string
  if (!title) {
    return
  }
  // info:为了使页面切换语言时标签名也能及时切换
  setDocumentTitleForLangChange(title)

  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.png'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export const setDocumentTitleForLangChange = (title: string) => {
  document.title = `${title}`
}

export const domTitle = config.systemName
