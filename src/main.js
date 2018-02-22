// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'
import http from './assets/js/http'
import store from './store'
import 'core-js/modules/es6.promise'

Vue.config.productionTip = false
Vue.prototype.$http = http
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
