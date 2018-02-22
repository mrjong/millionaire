import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import BroadCastCountDown from '@/views/broadCastCountDown.vue'
import BroadCasting from '@/views/broadCasting.vue'
import BroadCastNotBegin from '@/views/broadCastNotBegin.vue'
const Balance = () => import('@/views/Balance.vue')
const Rank = () => import('@/views/Rank.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'count-down',
          name: 'CountDown',
          component: BroadCastCountDown,
          beforeEnter: (to, from, next) => {
            if (from.fullPath !== '/home') {
              next('/home')
              return
            }
            next()
          }
        },
        {
          path: 'broadcasting',
          name: 'BroadCasting',
          component: BroadCasting,
          beforeEnter: (to, from, next) => {
            if (from.fullPath !== '/home') {
              next('/home')
              return
            }
            next()
          }
        },
        {
          path: 'not-begin',
          name: 'BroadCastNotBegin',
          component: BroadCastNotBegin,
          beforeEnter: (to, from, next) => {
            if (from.fullPath !== '/home') {
              next('/home')
              return
            }
            next()
          }
        }
      ]
    },
    {
      path: '/balance/:balance/:totalincome', // 用户余额，总收入 具体参数待定
      name: 'Balance',
      component: Balance
    },
    {
      path: '/rank',
      name: 'Rankt',
      component: Rank
    }
  ]
})
