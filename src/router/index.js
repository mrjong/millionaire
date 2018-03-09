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
      name: 'Login',
      component: Login
    },
    {
      path: '/await',
      name: 'Await',
      component: Await
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      children: [
        // {
        //   path: 'count-down',
        //   name: 'CountDown',
        //   component: CountDown,
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
      path: '/balance', // 用户余额，总收入 具体参数待定
      name: 'Balance',
      component: Balance
    },
    {
      path: '/rank',
      name: 'Rankt',
      component: Rank
    },
    {
      path: '/rule',
      name: 'rule',
      component: Rule
    }
  ]
})

router.beforeEach()

export default router
