import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import utilsjs from './utils/utils'
import './assets/css/style.css'
import "./assets/icons/index"
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.use(utilsjs)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
