// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Fingerprint2 from 'fingerprintjs2'
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

function statisticEntry () {
  utils.statistic('millionaire', 0, {style_s: ['', 'waiting', 'countdown', 'playing'][this.status] || 'unknown'})
}

// 若在h5页面或无clientId 则生成clientId
if (!utils.clientId) {
  new Fingerprint2({excludeFlashFonts: true, excludeJsFonts: true}).get((result) => {
    utils.clientId = result
  })
}
// 读取声音
utils.loadSounds()
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$http = http
Vue.prototype.$statisticEntry = statisticEntry
router.beforeEach((to, from, next) => {
  if (!utils.isOnline && !utils.clientId && to.name !== 'login') {
    next({path: '/login', replace: true})
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
