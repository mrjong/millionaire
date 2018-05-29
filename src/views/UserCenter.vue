<template>
  <div class="user">
    <div class="header">
      <p class="title">User Profile</p>
      <p class="back iconfont icon-fanhui" @click="back"> </p>
      <!-- <p class="edit"></p> -->
    </div>
    <div class="user__head">
      <img :src="userInfo.avatar">
    </div>
    <div class="user__wrap">
      <p class="name">
        <span class="name__icon iconfont icon-nicheng"></span>
        <span class="name__tip">Nickname</span>
        <span class="name__text">{{userInfo.userName}}</span>
      </p>
      <p class="paytm">
        <span class="paytm__icon iconfont icon-shouji"></span>
        <span class="paytm__tip">Phone Number</span>
        <span class="paytm__text">{{phone}}</span>
      </p>
      <p class="code">
        <span class="code__icon iconfont icon-yaoqingma"></span>
        <span class="code__tip">Referral Code</span>
        <span class="code__text">{{code}}</span>
      </p>
      <p class="cash-history" @click="jump('balance-record')">
        <span class="cash-history__icon iconfont icon-cashhistory"></span>
        <span class="cash-history__tip">Cash History</span>
        <span class="cash-history__text iconfont icon-LIVINGyoujiantou"></span>
      </p>
      <p class="contact" @click="jump('contact')">
        <span class="contact__icon iconfont icon-lianxiwomen"></span>
        <span class="contact__tip">Contact Us</span>
        <span class="contact__text iconfont icon-LIVINGyoujiantou"></span>
      </p>
    </div>
    <div class="logout-btn" @click="logOut">Log Out</div>
    <p class="bottom-text">
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/user_privacy.html'>User Agreement</a> &
      <a href='http://privacy.apusapps.com/policy/virtual_apusapps_activity/ALL/en/619/privacy.html'>Privacy Policy</a>
    </p>
    <balance-mark v-if="showDialog"
                  :data-info="dialogInfo"
                  @okEvent='okEvent'
                  @cancelEvent='cancelEvent'>
    </balance-mark>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import * as type from '../store/type'
import BalanceMark from '../components/BalanceMark'
import * as api from '../assets/js/api'
export default {
  name: 'Contact',
  data () {
    return {
      loading: false,
      showDialog: false,
      isLogout: false,
      dialogInfo: {
        htmlText: '',
        markType: false,
        okBtnText: 'OK'
      },
      phone: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      code: 'code'
    })
  },
  mounted () {
    utils.getPersonInfo((data) => {
      this.phone = data.mobile
    })
    utils.statistic('user_profile_page', 0, {}, 'wait_page')
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    jump (val) {
      if (val === 'balance-record') {
        utils.statistic('cash_history', 1, {}, 'user_profile_page')
        this.$router.push({path: '/balance-record', query: {'type': 'cash'}})
      } else if (val === 'contact') {
        utils.statistic('contact_us', 1, {}, 'user_profile_page')
        this.$router.push({path: '/contact'})
      }
    },
    logOut () {
      // 退出登录
      this.isLogout = true
      this.showDialog = true
      this.dialogInfo.markType = true
      this.dialogInfo.htmlText = 'Are you sure you want to log out?'
    },
    okEvent () {
      this.showDialog = false
      if (this.isLogout) {
        utils.logout(() => {
          utils.statistic('log_out', 1, {result_code_s: '1'}, 'user_profile_page')
          api.queryAgreePolicy().then(({data}) => {
            if (data.result === 1) {
              if (data.data.isEU) {
                this.$router.replace('/blank')
              } else {
                if (data.data.agree) {
                  this.$store.commit(type._UPDATE, {
                    isAgreePolicy: true
                  })
                } else {
                  this.$store.commit(type._UPDATE, {
                    isAgreePolicy: false
                  })
                }
              }
            } else {
              this.$store.commit(type._UPDATE, {
                isAgreePolicy: false
              })
            }
            this.$store.dispatch(type._INIT)
            this.$router.replace('/')
          })
        }, () => {
          // 登出失败
          utils.statistic('log_out', 1, {result_code_s: '0'}, 'user_profile_page')
          this.dialogInfo.htmlText = 'You failed to logout, please try again.'
          this.showDialog = true
        })
      }
    },
    cancelEvent () {
      this.showDialog = false
    }
  },
  components: {
    BalanceMark
  }
}
</script>
<style scoped lang="less" type="text/less">
  .user {
    width: 100%;
    min-height: 100%;
    background: url("../assets/images/await-bg.jpg") no-repeat top left;
    background-size: cover;
    padding: 3.7% 3.7% 0;
    display: flex;
    flex-direction: column;
    .header {
      width: 100%;
      min-height: 51.5px;
      position: relative;
      box-sizing: content-box;
      .back {
        width: 51.5px;
        height: 51.5px;
        border-radius: 51.5px;
        background-color: #3f3567;
        font-size: 24.67px;
        line-height: 51.5px;
        padding: 2px 2px 0 0;
        text-align: center;
        position: absolute;
        left: 0;
      }
      .title {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        text-align: center;
        font: 400 36px/51.5px 'Roboto', Arial, serif;
        color: #fff;
      }
    }
    &__head{
      width: 133px;
      height: 133px;
      margin: 80px auto 40px;
      img{
        width: 100%;
        border-radius: 50%;
      }
    }
    &__wrap{
      .name, .paytm, .code, .cash-history, .contact{
        display: flex;
        justify-content: space-between;
        max-width: 100%;
        width: 657px;
        height: 93px;
        text-align: center;
        color:#fff;
        font:32px 'Roboto', Arial, serif;
        line-height: 93px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        margin-top: 26px;
        position: relative;
        &__icon {
          height: 100%;
          font-size: 36px;
          display: block;
          border-radius: 50%;
          position: absolute;
          top:50%;
          left: 5px;
          transform: translate(0,-50%);
        }
        &__tip{
          margin-left: 66px;
          opacity: 0.3;
          font: 32px 'Roboto', Arial, serif;
          line-height: 93px;
        }
        &__text{
          font: 32px 'Roboto', Arial, serif;
          line-height: 93px;
        }
        .mail {
          background: url('../assets/images/icon-small-gmail.png') no-repeat center;
          background-size: cover;
        }
        .fb {
          background: url('../assets/images/icon-small-fb.png') no-repeat center;
          background-size: cover;
        }
        .twitter {
          background: url('../assets/images/icon-small-twitter.png') no-repeat center;
          background-size: cover;
        }
        .ins {
          background: url('../assets/images/icon-small-ins.png') no-repeat center;
          background-size: cover;
        }
      }
    }
    .logout-btn{
      max-width: 100%;
      width: 657px;
      height: 93px;
      border-radius: 46px;
      text-align: center;
      color:#fff;
      font:32px 'Roboto', Arial, serif;
      line-height: 93px;
      background-color: rgba(255, 255, 255, 0.5);
      margin-top: 100px;
  }
    .bottom-text{
      margin: 25px 0;
      font: 200 24px 'Roboto', Arial, serif;
      color: #fff;
      text-align: center;
      a{
        color: #fff;
      }
    }
  }
</style>
