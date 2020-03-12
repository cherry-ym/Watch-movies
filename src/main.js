import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
Vue.prototype.axios = axios;

Vue.filter('setWH',(url, arg)=>{
  return url.replace(/w\.h/,arg);
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
