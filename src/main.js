// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Components
import './components'

// Plugins
import './plugins'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import Vuetify from 'vuetify'
import theme from './plugins/theme'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import VCurrencyField from 'v-currency-field'
import VTextField from "vuetify/lib/components/VTextField/VTextField";


Vue.prototype.$http = axios
// Sets the default url used by all of this axios instance's requests
axios.defaults.baseURL = 'http://localhost:8000/api/'
axios.defaults.headers.get['Accept'] = 'application/json'

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

// Sync store with router
sync(store, router)

Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme
})

Vue.use(VCurrencyField, {
  locale: 'pt-BR',
  decimalLength: 2,
  autoDecimalMode: true,
  min: null,
  max: null,
  defaultValue: 0
})

Vue.component('v-text-field', VTextField)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
