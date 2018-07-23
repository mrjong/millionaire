<template>
  <div class="invite bg-reset" v-webp.bg="`url('invite-bg.jpg')`">
    <p class="invite__back icon-fanhui iconfont" @click="back"></p>
    <p class="invite__rule" @click="showDialog = true">{{$t('invite.rule_bnt')}}</p>
    <div class="invite__title">
      <img v-webp="'invite-title-hi.png'" class="invite__title__img" v-if="$i18n.locale === 'hi'">
      <img v-webp="'invite-title-en.png'" class="invite__title__img" v-else>
    </div>
    <div class="invite__btn">
      <div class="invite__btn__click" @click="inviteEarn">
        <img v-webp="'invite-btn.png'">
        <p>{{$t('invite.invite_btn')}}</p>
      </div>
    </div>
    <div class="invite__step">
      <p class="invite__step__title">{{$t('invite.steps_title')}}</p>
      <div class="invite__step__content">
        <div class="icon-img">
          <span class="icon-youjiantou iconfont arrows1"></span>
          <span class="icon-youjiantou iconfont arrows2"></span>
          <div class="icon">
            <img src="../assets/images/coin1.png">
          </div>
          <div class="icon">
            <img src="../assets/images/coin2.png">
          </div>
          <div class="icon">
            <img src="../assets/images/coin3.png">
          </div>
        </div>
        <div class="num-money">
          <p class="text">+10</p>
          <p class="text">+20</p>
          <p class="text">+30</p>
        </div>
        <div class="step-text">
          <p class="text" v-for="(val, idx) in $t('invite.steps')" :key="idx">{{val}}</p>
        </div>
      </div>
    </div>
    <div class="invite__mytask">
      <p class="invite__mytask__title">{{$t('invite.steps_title')}}</p>
      <div class="invite__mytask__content">
        <div class="icon-img">
          <span class="icon-youjiantou iconfont arrows1"></span>
          <span class="icon-youjiantou iconfont arrows2"></span>
          <div class="progress-ball">
          </div>
          <div class="progress-ball">
          </div>
          <div class="progress-ball">
          </div>
        </div>
        <div class="num-money">
          <p class="text">10 Friends</p>
          <p class="text">6 Friends</p>
          <p class="text">3 Friends</p>
        </div>
        <div class="step-text">
          <p class="text" v-for="(val, idx) in 3" :key="idx">play {{val}} times</p>
        </div>
      </div>
    </div>
    <div class="invite__rewards">
      <p class="invite__rewards__title">{{$t('invite.steps_title')}}</p>
      <div class="invite__rewards__content">
        <div class="icon-img reward-icon" >
          <div class="icon" v-for="(i,idx) in 3" :key="idx">
            <img src="../assets/images/coin-icon.png">
            <span class="text">+ 100</span>
          </div>
        </div>
        <div class="rewards-text">
          <p class="text" v-for="(val, idx) in $t('invite.rewards')" :key="idx">{{val}}</p>
        </div>
        <div class="invite__rewards__btn">You'll get ₹5 if your friends invited new user to play</div>
      </div>
    </div>
    <div class="invite__list">
      <div class="tap">
        <p class="title" @click="changeTap(idx)" :class="{'tap-active': idx === index}" v-for="(val, idx) in tap" :key="idx">{{val}}</p>
      </div>
      <div class="content3" v-if="index === 0">
        <div class="my-invite" v-if="myInviteData.length > 0">
          <div class="my-info bg-reset bg-center" v-webp.bg="`url('invite-user-bg.png')`" v-if="myInviteInfo">
            <img :src="myInviteInfo.upic" class="head">
            <p class="nickname">{{myInviteInfo.nick}}</p>
            <p class="number">{{$t('invite.rank_text1', {number: myInviteInfo.sc})}}</p>
            <p class="money">{{$t('invite.rank_text2')}}{{userInfo.currencyType}}{{myInviteInfo.amountFmt}}</p>
          </div>
          <div class="item" v-if="myInviteData.length > 0">
            <div class="rank-item" v-for="(val, idx) in myInviteData" :key="idx">
              <p class="index">{{val.rank}}</p>
              <div class="head">
                <img :src="val.upic">
              </div>
              <div class="userinfo">
                <p class="nickname">{{val.nick}}</p>
                <p class="date">{{val.status === 1? $t('invite.rank_text5', {time: ' ' + val.bd}): $t('invite.rank_text6', {time: ' ' + val.bd})}}</p>
              </div>
              <div class="invite-data">
                <p class="money">+{{userInfo.currencyType}}{{val.amountFmt}}</p>
                <p class="number">{{val.status === 1 ? $t('invite.rank_text3') : $t('invite.rank_text4')}}</p>
              </div>
            </div>
            <div class="more-button" @click="getMoreInvite" v-if="isShowMoreBtn">Get More</div>
          </div>
          <div class="hint">{{$t('invite.rank_hint')}}</div>
        </div>
        <invite-blank v-else></invite-blank>
      </div>
      <div class="content1" v-if="index === 1">
        <top-three v-if="!isHaveData" :BoardData="weekTopThree"></top-three>
        <invite-rank-item v-if="!isHaveData" v-for="(val, idx) in weekData" :key="idx" :BoardData=val></invite-rank-item>
        <invite-blank v-if="isHaveData"></invite-blank>
      </div>
      <div class="content2" v-if="index === 2">
        <top-three v-if="!isHaveData" :BoardData="totalTopThree"></top-three>
        <invite-rank-item v-if="!isHaveData" v-for="(val, idx) in totalData" :key="idx" :BoardData="val"></invite-rank-item>
        <invite-blank v-if="isHaveData"></invite-blank>
      </div>
    </div>
    <revive-card :reviveObj="reviveObj" @shareClose="shareClose"></revive-card>
    <loading v-if="isLoading"></loading>
    <balance-mark v-if="showDialog" :data-info="dialogInfo" @okEvent='okEvent'></balance-mark>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import utils from '../assets/js/utils'
import BalanceMark from '../components/BalanceMark'
import * as api from '../assets/js/api'
import TopThree from '../components/TopThree'
import InviteRankItem from '../components/InviteRankItem'
import ReviveCard from '../components/ReviveCard'
import InviteBlank from '../components/InviteBlank'
import Loading from '../components/Loading'
import * as type from '../store/type'
export default {
  name: 'Invite',
  data () {
    return {
      dialogInfo: {
        htmlTitle: this.$t('invite.rule_bnt'),
        htmlText: `<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[0]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[1]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[2]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[3]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[4]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[5]')}</p>`,
        shouldSub: false,
        markType: false,
        okBtnText: this.$t('tip.lateJoin.btn')
      },
      reviveObj: {
        isShare: false,
        title: this.$t('receiveCard.invite_pop.text1'),
        hint: this.$t('receiveCard.invite_pop.text2'),
        type: 'invite'
      },
      showDialog: false,
      tap: this.$t('invite.rank_text'),
      index: 0,
      weekTopThree: [],
      weekData: [],
      totalTopThree: [],
      totalData: [],
      myInviteInfo: {},
      myInviteData: [],
      isHaveData: false,
      isLoading: false,
      isShowMoreBtn: true,
      offset: 0,
      limit: 10
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    utils.statistic('invite_earn_page', 0)
    this.getMyInviteData()
  },
  methods: {
    getMoreInvite () {
      this.getMyInviteData()
    },
    back () {
      this.$router.go(-1)
    },
    changeTap (idx) {
      this.index = idx
      if (idx !== 0) {
        this.getData(idx)
      } else {
        this.getMyInviteData()
      }
    },
    getMyInviteData () {
      if (this.isLoading) return
      this.isLoading = true
      api.myInviteBoard(this.offset, this.limit).then(({data}) => {
        this.isLoading = false
        if (data.result === 1 && data.code === 0) {
          let dataLength = data.data.list.length
          if (dataLength > 0) {
            if (dataLength < this.limit) {
              this.isShowMoreBtn = false
            }
            this.isHaveData = false
            this.myInviteInfo = data.data.me
            let myInviteData = data.data.list
            this.myInviteData.push(...myInviteData)
            this.offset += this.limit
          } else {
            this.isHaveData = true
          }
        } else {
          this.isHaveData = true
        }
      }).catch((e) => {
        this.isHaveData = true
        this.isLoading = false
      })
    },
    getData (index) {
      this.isLoading = true
      if (index === 0) {
        api.inviteWeeklyBoard().then(({data}) => {
          this.isLoading = false
          if (data.result === 1 && data.code === 0 && data.data.length > 0) {
            this.isHaveData = false
            if (data.data.length <= 3) {
              this.weekTopThree = data.data.slice(0, data.data.length)
            } else if (data.data.length >= 3) {
              this.weekTopThree = data.data.slice(0, 3)
              this.weekData = data.data.slice(3, data.data.length + 1)
            }
          } else {
            this.isHaveData = true
          }
        }).catch((e) => {
          this.isHaveData = true
          this.isLoading = false
        })
      } else if (index === 1) {
        api.inviteTotalBoard().then(({data}) => {
          this.isLoading = false
          if (data.result === 1 && data.code === 0 && data.data.length > 0) {
            this.isHaveData = false
            if (data.data.length <= 3) {
              this.totalTopThree = data.data.slice(0, data.data.length)
            } else if (data.data.length > 3) {
              this.totalTopThree = data.data.slice(0, 3)
              this.totalData = data.data.slice(3, data.data.length + 1)
            }
          } else {
            this.isHaveData = true
          }
        }).catch((e) => {
          this.isHaveData = true
          this.isLoading = false
        })
      }
    },
    inviteEarn () {
      utils.statistic('invite_earn_button', 1)
      if (utils.isOnline) {
        this.reviveObj.isShare = true
      } else {
        utils.login(() => {
          this.$store.dispatch(type._INIT)
          this.$router.push({path: '/invite'})
        })
      }
    },
    shareClose () {
      this.reviveObj.isShare = false
    },
    // 弹框ok
    okEvent (a, b) {
      this.showDialog = false
    }
  },
  components: {
    BalanceMark,
    TopThree,
    InviteRankItem,
    InviteBlank,
    Loading,
    ReviveCard
  },
  watch: {
  }
}
</script>
<style scoped lang="less" type="text/less">
  .invite{
    width: 100%;
    min-height: 100%;
    padding: 0 20px 30px;
    position: relative;
    background-color: #2c1bb8;
    background-size: contain;
    &__back,&__rule {
      position: absolute;
      top: 25px;
      font: 28px 'Roboto', Arial, serif;
      height: 54px;
      line-height: 54px;
      background-color: #241dd0;
      text-align: center;
      color:#fff;
    }
    &__back{
      left: 25px;
      width: 54px;
      border-radius: 50%;
      font-size: 24px;
    }
    &__rule {
      right: 0;
      width: 100px;
      border-top-left-radius: 24px 24px;
      border-bottom-left-radius: 24px 24px;
    }
    &__title {
      width: 620px;
      margin: 0 auto 250px;
      padding-top: 70px;
      &__img {
        max-width: 100%;
        width: 620px;
        height: 332px;
      }
    }
    &__btn{
      &__click {
        position: relative;
        max-width:98%;
        width: 680px;
        border-radius: 24px;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        font: 600 40px 'Roboto', Arial, serif;
        line-height: 95px;
        img{
          max-width: 100%;
          width: 670px;
          height: 100px;
        }
        p{
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%,0);
          width: 100%;
        }
      }
    }
    &__step, &__rewards, &__mytask{
      width: 680px;
      min-height: 400px;
      max-width: 100%;
      background-color: #fff;
      border-radius: 24px;
      margin: 25px auto;
      padding: 30px;
      &__title{
        margin-bottom: 30px;
        color: #201a98;
        font:600 32px 'Roboto', Arial, serif;
        text-align: center;
      }
      &__content{
        .icon-img {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          .arrows1, .arrows2 {
            position:absolute;
            top: 50%;
            left: 30%;
            transform: translate(0,-50%);
            font-size: 34px;
            color:#fbb631;
            opacity: 0.5;
          }
          .arrows2{
            left: 64%;
          }
          .icon{
            flex: 1;
            align-self: center;
            img{
              width: 115px;
              margin: 0 auto;
            }
          }
          .progress-ball {
            align-self: center;
            width: 153px;
            height: 153px;
            border-radius: 50%;
            background-color:#f8f8f8;
          }
        }
        .reward-icon{
          .icon{
            display: flex;
            align-items: center;
            justify-content: center;
            img{
              width: 95px;
              height: 71px;
              margin: 0 10px 0 0;
            }
            .text{
            color: #fa8d36;
            font: 600 28px 'Roboto', Arial, serif;
          }
          }
        }
        .num-money {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          justify-content: center;
          align-items: flex-start;
          margin: 15px 0;
          .text {
            flex: 1;
            align-self: center;
            color: #fa8d36;
            font: 600 36px 'Roboto', Arial, serif;
            text-align: center;
            img {
              width: 60px;
              height: 60px;
              margin: 0 auto;
            }
          }
        }
        .step-text ,.rewards-text{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #201a98;
          font: 24px 'Roboto', Arial, serif;
          .text{
            line-height: 30px;
            width: 90%;
            text-align: center;
          }
        }
        .rewards-text{
          margin-top: 20px;
        }
      }
      &__btn {
        width: 630px;
        height: 76px;
        font: 400 24px "Roboto", Arial, serif;
        line-height: 76px;
        text-align: center;
        color: #fff;
        border-radius:46px;
        background:linear-gradient(left, #f6cd46 , #fc642b);
        margin-top: 45px;
      }
    }
    &__mytask{
      &__content{
        .icon-img{
          justify-content: space-around;
        }
        .num-money{
          .text{
            font-size: 28px;
          }
        }
      }
    }
    &__list{
      width: 680px;
      max-width: 100%;
      max-height: 1020px;
      min-height: 680px;
      background-color: #fff;
      border-radius: 24px;
      margin: 25px auto;
      overflow: hidden;
      .tap{
        width: 100%;
        height: 90px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        background: -webkit-linear-gradient(left,rgba(98, 199, 252, 0.7),rgba(68, 133, 229, 0.7));
        .title{
          flex: 1;
          font: 28px 'Roboto', Arial, serif;
          line-height: 90px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }
        .tap-active {
          color: rgba(255, 255, 255, 1);
          background: -webkit-linear-gradient(left,#62c7fc,#4485e5);
        }
      }
      .content1, .content2{
        width: 100%;
        max-height: 940px;
        padding-bottom: 20px;
        overflow-y: scroll;
      }
      .content3 {
        overflow-y: scroll;
        max-height: 940px;
        padding-bottom: 20px;
        .my-info{
          width: 100%;
          background: url('../assets/images/invite-user-bg.png') no-repeat center;
          background-size: cover;
          padding-top:37px;
          .head{
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin: 0 auto;
          }
          .nickname, .number{
            margin-top: 20px;
            color:#201a98;
            font: 24px 'Roboto', Arial, serif;
            text-align: center;
          }
          .number{
            font-size: 20px;
          }
          .money {
            width: 200px;
            height: 40px;
            font: 24px 'Roboto', Arial, serif;
            line-height: 43px;
            margin-top: 10px;
            text-align: center;
            background-color: #ffb03e;
            color:#fff;
            border-radius: 24px;
            margin: 20px auto;
          }
        }
        .item {
          padding:20px 20px 0;
          .more-button {
            margin-top: 15px;
            color: #ccc;
            width: 100%;
            text-align: center;
            font: 200 26px "Roboto", Arial, serif;
            height: 40px;
            line-height: 40px;
            font-weight: bold;
          }
          .rank-item {
            box-sizing: content-box;
            padding-top: 20px;
            width: 100%;
            height: 120px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid rgba(34,15,96,0.2);
            .index {
              align-self: center;
              color:#201a98;
              font: 36px 'Roboto', Arial, serif;
            }
            .head{
              width: 100px;
              height: 100px;
              border-radius: 50%;
              overflow: hidden;
              margin: 0 20px;
              img{
                width:100%;
              }
            }
            .userinfo {
              height: 100%;
              flex: 2;
              align-self: center;
              color: #201a98;
              font: 24px 'Roboto', Arial, serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              p{
                height: 40px;
                font: 24px 'Roboto', Arial, serif;
                line-height: 20px;
                line-height: 37px;
              }
              .date{
                opacity: 0.8;
              }
            }
            .invite-data{
              display: flex;
              flex-direction: column;
              justify-content: center;
              .number{
                color: #201a98;
                font: 24px 'Roboto', Arial, serif;
              }
              .money {
                height: 40px;
                font: 24px 'Roboto', Arial, serif;
                line-height: 20px;
                color:#ffb03e;
                text-align: right;
              }
            }
          }
        }
        .hint {
          margin-top: 20px;
          color:#201a98;
          font: 24px 'Roboto', Arial, serif;
          text-align: center;
        }
      }
    }
  }
</style>
