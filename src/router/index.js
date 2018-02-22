import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import BroadCastAwait from '@/views/BroadCastAwait.vue'
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
      path: '/await',
      name: 'Await',
      component: BroadCastAwait
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      children: [
        // {
        //   path: 'count-down',
        //   name: 'CountDown',
        //   component: BroadCastCountDown,
        //   beforeEnter: (to, from, next) => {
        //     if (from.fullPath !== '/home') {
        //       next('/home')
        //       return
        //     }
        //     next()
        //   }
        // }
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
