<template>
  <div class="invitation-mark"  v-if="reviveObj.isShare">
    <div class="invitation-bomb">
      <span class="invitation-bomb__close iconfont icon-cuowu" @click="shareClose"></span>
      <p class="invitation-bomb__info">
        {{reviveObj.title? reviveObj.title :'My Referral Code:'}}
        <span v-if="!reviveObj.title">{{reviveObj.code}}</span>
      </p>
      <p class="invitation-bomb__hint">{{reviveObj.hint ? reviveObj.hint : 'Inviting friends to get it now!'}}</p>
      <div class="invitation-bomb__channel">
        <div v-for="(val, idx) in shareObj"
        :key="idx"
        :class="val.className"
        @click="fbAndMess(val.packgename)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import * as api from '../assets/js/api'
export default {
  name: 'ReviveCard',
  props: {
    reviveObj: {
      type: Object
    }
  },
  data () {
    return {
      isClose: false,
      shareObj: [
        {
          className: 'facebook',
          packgename: 'com.facebook.katana'
        },
        {
          className: 'message',
          packgename: 'com.facebook.orca'
        },
        {
          className: 'whatsapp',
          packgename: 'com.whatsapp'
        },
        {
          className: 'twitter',
          packgename: 'com.twitter.android'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      code: 'code'
    })
  },
  methods: {
    fbAndMess (val) {
      if (this.reviveObj.type === 'invite') {
        utils.statistic('invite_earn_share', 3, {to_destination_s: val}, 'invite_earn_page')
        let title = `I'm playing 'Go! Millionaire', my referral code is ${this.code}，join us and win up to Rs.1,000,000 at 10PM every day!`
        let desp = `Download Go!Millonaire Browser and use my referral code 345566, let keep winning cash every day!`
        api.inviteLink().then(({data}) => {
          if (data.result === 1 && data.code === 0 && data.data) {
            utils.share(this.callbackFn, val, '', encodeURIComponent(data.data), '', title, desp)
          } else {
            return false
          }
        }).catch((e) => {
          return false
        })
      } else {
        utils.statistic('millionaire', 1, {to_destination_s: val}, 'share-detail_page')
        utils.share(this.callbackFn, val, '', encodeURIComponent('http://millionaire.apusapps.com/index.html?referrer=invite'), this.code)
      }
    },
    // 分享后的回调
    callbackFn (isSucceed, packageName) {
      this.reviveObj.isShare = false
      if (!isSucceed) {
        this.$emit('callbackFailed')
      }
    },
    shareClose () {
      this.$emit('shareClose')
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .invitation-mark {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 111;
      padding: 0 25px;
      background-color: rgba(0, 0, 0, 0.8);
      .invitation-bomb {
        max-width: 93% !important;
        width: 670px;
        height: 350px;
        background-color: #fff;
        border-radius: 26px;
        position: absolute;
        bottom: 25px;
        padding: 50px 0 40px;
        color: #241262;
        text-align: center;
        font-family: "Roboto";
        &__close{
          position:absolute;
          top: 24px;
          right: 24px;
          color: #241262;
          font-size: 20px;
        }
        &__info{
          font-size: 32px;
          margin-bottom: 20px;
          .share-detail-entry{
            font-size: 32px;
            color: #241262;
          }
        }
        &__hint{
          font-weight: 300;
          margin-bottom: 54px;
          font-size: 28px;
          padding: 0 30px;
        }
        &__channel{
          overflow-y:hidden;
          overflow-x:auto;
          white-space: nowrap;
          padding-bottom: 15px;
          .facebook, .message, .whatsapp, .ins, .twitter{
            width: 96px;
            height: 96px;
            display: inline-table;
            vertical-align: top;
            margin-left: 45px;
          }
           .facebook{
            background: url("../assets/images/facebook.png") no-repeat center;
            background-size: cover;
            margin-left: 0;
           }
          .message{
            background: url("../assets/images/messenger.png") no-repeat center;
            background-size: cover;
          }
          .whatsapp{
            background: url("../assets/images/whatsapp.png") no-repeat center;
            background-size: cover;
          }
          .twitter{
            background: url("../assets/images/twitter.png") no-repeat center;
            background-size: cover;
          }
          .ins{
            background: url("../assets/images/ins.png") no-repeat center;
            background-size: cover;
          }
        }
      }
    }
</style>
