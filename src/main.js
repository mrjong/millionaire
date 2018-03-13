// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import utils from './assets/js/utils'
// import axios from 'axios'
import http from './assets/js/http'
import store from './store'
import 'core-js/modules/es6.promise'
import im from './assets/js/im'
im.init()
utils.loadSounds()
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$http = http
router.beforeEach((to, from, next) => {
  const nextRouter = ['await', 'main', 'rule', 'balance', 'rank']
  if (nextRouter.indexOf(to.name) >= 0) {
    if (!utils.isOnline) {
      router.push({path: '/login'})
    }
  }
  if (to.name === 'login') {
    if (utils.isOnline) {
      router.push({path: '/await'})
    }
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
