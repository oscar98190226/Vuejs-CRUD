import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'

import { CHECK_AUTH } from './store/actions'
import ApiService from './common/api.service'
import ErrorFilter from './common/error.filter'

Vue.config.productionTip = false
Vue.filter('error', ErrorFilter)
Vue.use(Vuetify)

ApiService.init()

// Ensure we checked auth before each page load.
router.beforeEach((to, from, next) =>
  Promise.all([store.dispatch(CHECK_AUTH)]).then(next)
)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
