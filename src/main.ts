import { createApp } from 'vue'

import App from './App.vue'

import router from './router'
import store from './stores'

// 重置样式
import './styles/reset.scss'
// 公共样式
import './styles/index.scss'

const app = createApp(App)
app.use(router).use(store).mount('#app')
