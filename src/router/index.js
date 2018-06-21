import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import Await from '@/views/Await.vue'
const SetQuestion = () => import('@/views/SetQuestion.vue')
const SetQuestionResult = () => import('@/views/SetQuestionResult.vue')
const Rule = () => import('@/views/Rule.vue')
const Balance = () => import('@/views/Balance.vue')
const Rank = () => import('@/views/Rank.vue')
const ShareDetail = () => import('@/views/ShareDetail.vue')
const BalanceRecord = () => import('@/views/BalanceRecord.vue')
// const Practice = () => import('@/views/Practice.vue')
const BalanceDetail = () => import('@/views/BalanceDetail.vue')
// const Policy = () => import('@/views/Policy.vue')
const Contact = () => import('@/views/Contact.vue')
const UserCenter = () => import('@/views/UserCenter.vue')
const Blank = () => import('@/views/Blank.vue')
// const Video = () => import('@/views/Video.vue')
// const SamllAwait = () => import('@/views/SmallAwait.vue')
const Invite = () => import('@/views/Invite.vue')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Await
    },
    {
      path: '/login',
      name: 'login',
      component: Login
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
    },
    {
      path: '/set-question',
      name: 'set-question',
      component: SetQuestion
    },
    {
      path: '/set-question-result',
      name: 'set-question-result',
      component: SetQuestionResult
    },
    {
      path: '/share-detail',
      name: 'share-detail',
      component: ShareDetail
    },
    {
      path: '/balance-record',
      name: 'balance-record',
      component: BalanceRecord
    },
    // {
    //   path: '/practice',
    //   name: 'practice',
    //   component: Practice
    // },
    {
      path: '/balance-detail',
      name: 'balance-detail',
      component: BalanceDetail
    },
    // {
    //   path: '/policy',
    //   name: 'policy',
    //   component: Policy
    // },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/user-center',
      name: 'user-center',
      component: UserCenter
    },
    {
      path: '/blank',
      name: 'blank',
      component: Blank
    },
    // {
    //   path: '/video',
    //   name: 'video',
    //   component: Video
    // },
    {
      path: '/invite',
      name: 'invite',
      component: Invite
    }
    // {
    //   path: '/small-await',
    //   name: 'small-await',
    //   component: SamllAwait
    // }
  ]
})

export default router
