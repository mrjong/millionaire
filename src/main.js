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
import { _OPEN_DIALOG } from './store/type'
im.init()

window.onload = function () {
  // 初始化打点
  utils.statistic('referrer', 0, {
    style_s: window.top.njordGame ? 'app' : 'h5' // 页面类型
  }, utils.getQuery('referrer'))
}

window.addEventListener('beforeinstallprompt', function (event) {
  // 统计用户的选择
  event.userChoice.then((choiceResult) => {
    console.log(choiceResult.outcome) // 为 dismissed 或 accepted
    if (choiceResult.outcome === 'accepted') {
      utils.statistic('ADD_TO_HOMESCREEN', 1, {
        result_code_s: '1'
      })
      console.log('User accepted home screen install')
    } else {
      utils.statistic('ADD_TO_HOMESCREEN', 1, {
        result_code_s: '0'
      })
      console.log('User canceled home screen install')
    }
  })
})

function statisticEntry () {
  utils.statistic('millionaire', 0, {style_s: ['', 'waiting', 'countdown', 'playing'][this.status] || 'unknown'})
}

// 若在h5页面或无clientId 则生成clientId
if (!utils.clientId) {
  const clientId = utils.storage.get('millionaire-clientId')
  if (clientId) {
    utils.clientId = clientId
  } else {
    new Fingerprint2({excludeFlashFonts: true, excludeJsFonts: true}).get((result) => {
      utils.clientId = result
      utils.storage.set('millionaire-clientId', result)
    })
  }
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
export const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      registration.onupdatefound = () => {
        console.log('onupdatefound')
        vm.$store.dispatch(_OPEN_DIALOG, {
          htmlTitle: 'New Version Available',
          htmlText: `Quit and then open, or you can clear browser cache to upgrade. Experience the latest feature to win cash now!`,
          lastTime: -1,
          okBtnText: 'Upgrade Now',
          hintImg: './static/images/tip-update.png',
          okEvent: function () {
            window.location.reload()
          }
        })
        // registration.update().then(() => setTimeout(() => {
        //   window.location.reload()
        // }, 500))
      }
      console.log('Service Worker registered22: ', registration)
    }).catch(registrationError => {
      console.log('Service Worker failed: ', registrationError)
    })
  })
}
