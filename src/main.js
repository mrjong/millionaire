// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Fingerprint2 from 'fingerprintjs2'
import Vue from 'vue'
import App from './App'
import Image from './components/StaticImage.vue'
import router from './router'
import utils from './assets/js/utils'
// import axios from 'axios'
import http from './assets/js/http'
import store from './store'
import i18n from './i18n'
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
Vue.prototype.$http = http
Vue.config.devtools = true
Vue.prototype.$statisticEntry = statisticEntry
router.beforeEach((to, from, next) => {
  if (!utils.isOnline && !utils.clientId && to.name !== 'login') {
    next({path: '/login', replace: true})
  } else {
    next()
  }
})

Vue.component('static-image', Image) // 初始化图片组件

Vue.directive('bg-img', (el, {value = ''}) => {
  // 将多个值以空格分割
  const vals = value.split(' ')
  const imgUrl = vals[0] || ''
  const resetVal = vals.slice(1).join(',')
  el.style.backgroundImage = `url('${utils.getImageUrl(imgUrl)}'), ${resetVal}`
})
/* eslint-disable no-new */
export const vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      registration.onupdatefound = () => {
        console.log('onupdatefound')
        vm.$store.dispatch(_OPEN_DIALOG, {
          htmlTitle: i18n.t('tip.versionUpdate.title'),
          htmlText: i18n.t('tip.versionUpdate.desp'),
          lastTime: 5000,
          okBtnText: i18n.t('tip.versionUpdate.btn'),
          hintImg: './static/images/tip-update.png'
        })
      }
      console.log('Service Worker registered35: ', registration)
    }).catch(registrationError => {
      console.log('Service Worker failed: ', registrationError)
    })
  })
}
