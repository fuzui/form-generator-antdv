import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import axios from 'axios'
import i18n from '@/locales'
import antd from 'ant-design-vue'
import '@/utils/filter' // global filter
import bootstrap from '@/core/bootstrap'
import store from '@/store'

Vue.use(antd)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App),
  i18n
}).$mount('#app')
