import { createApp } from './main'
// vue框架提供了该方法把组件转化为字符串
import { renderToString } from '@vue/server-renderer'

export async function render(url, manifest) {
  const { app, router, store } = createApp()
  // await router.push(url)
  // await router.isReady()
  const appHtml = await renderToString(app)
  return appHtml
}
