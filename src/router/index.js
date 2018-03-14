import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import Await from '@/views/Await.vue'
import Rule from '@/views/Rule.vue'
const Balance = () => import('@/views/Balance.vue')
const Rank = () => import('@/views/Rank.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/await',
      name: 'await',
      component: Await
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/balance', // 用户余额，总收入 具体参数待定
      name: 'balance',
      component: Balance
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/rule',
      name: 'rule',
      component: Rule
    }
  ]
})

export default router
