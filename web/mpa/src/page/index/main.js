import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  // const store = createSSRStore()
  // const router = createSSRRouter()
  // const i18n = createSSRI18n()
  // sync(store, router)
  // app.config.globalProperties.$message = ElMessage
  // app.use(store, key)
  // app.use(router)
  // app.use(ElementPlus)
  // app.use(i18n)

  return { app }
}