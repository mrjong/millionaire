<template>
  <div class="invite">
    <p class="invite__back icon-fanhui iconfont" @click="back"></p>
    <p class="invite__rule" @click="showDialog = true">{{$t('invite.rule_bnt')}}</p>
    <div class="invite__btn">
      <p class="invite__btn__click"  @click="inviteEarn">{{$t('invite.invite_btn')}}</p>
    </div>
    <div class="invite__step">
      <p class="invite__step__title">{{$t('invite.steps_title')}}</p>
      <div class="invite__step__content">
        <div class="icon-img">
          <div class="icon">
            <img src="../assets/images/invite-icon1.png">
          </div>
          <div class="icon">
            <img src="../assets/images/invite-icon2.png">
          </div>
          <div class="icon">
            <img src="../assets/images/invite-icon3.png">
          </div>
        </div>
        <div class="num-img">
          <div class="num">
            <img src="../assets/images/invite-step1.png">
          </div>
          <div class="num">
            <img src="../assets/images/invite-step2.png">
          </div>
          <div class="num">
            <img src="../assets/images/invite-step3.png">
          </div>
        </div>
        <div class="step-text">
          <p class="text" v-for="(val, idx) in $t('invite.steps')" :key="idx">{{val}}</p>
        </div>
      </div>
    </div>
    <div class="invite__list">
      <div class="tap">
        <p class="title" @click="changeTap(idx)" :class="{'tap-active': idx === index}" v-for="(val, idx) in tap" :key="idx">{{val}}</p>
      </div>
      <div class="content1" v-if="index === 0">
        <top-three v-if="!isHaveData" :BoardData="weekTopThree"></top-three>
        <invite-rank-item v-if="!isHaveData" v-for="(val, idx) in weekData" :key="idx" :BoardData=val></invite-rank-item>
        <invite-blank v-if="isHaveData"></invite-blank>
      </div>
      <div class="content2" v-if="index === 1">
        <top-three v-if="!isHaveData" :BoardData="totalTopThree"></top-three>
        <invite-rank-item v-if="!isHaveData" v-for="(val, idx) in totalData" :key="idx" :BoardData="val"></invite-rank-item>
        <invite-blank v-if="isHaveData"></invite-blank>
      </div>
      <div class="content3" v-if="index === 2">
        <div class="my-invite" v-if="!isHaveData">
          <div class="my-info" v-if="myInviteInfo">
            <img :src="myInviteInfo.upic" class="head">
            <p class="nickname">{{myInviteInfo.nick}}</p>
            <p class="number">{{$t('invite.rank_text1', {number: myInviteInfo.sc})}}</p>
            <p class="money">{{$t('invite.rank_text2')}}{{userInfo.currencyType}}{{myInviteInfo.amountFmt}}</p>
          </div>
          <div class="item" v-if="myInviteData">
            <div class="rank-item" v-for="(val, idx) in myInviteData" :key="idx">
              <p class="index">{{val.rank}}</p>
              <div class="head">
                <img :src="val.upic">
              </div>
              <div class="userinfo">
                <p class="nickname">{{val.nick}}</p>
                <p class="date">{{val.status === 1? $t('invite.rank_text5'): $t('invite.rank_text6')}}{{ ' ' + val.bd}}</p>
              </div>
              <div class="invite-data">
                <p class="money">+{{userInfo.currencyType}}{{val.amountFmt}}</p>
                <p class="number">{{val.status === 1 ? $t('invite.rank_text3') : $t('invite.rank_text4')}}</p>
              </div>
            </div>
          </div>
          <div class="hint">{{$t('invite.rank_hint')}}</div>
        </div>
        <invite-blank v-else></invite-blank>
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
        htmlTitle: 'Rules',
        htmlText: `<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[0]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[1]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[2]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[3]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[4]')}</p>
<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[5]')}</p>`,
        shouldSub: false,
        markType: false,
        okBtnText: 'OK'
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
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    utils.statistic('invite_earn_page', 0)
    this.getData(0)
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    changeTap (idx) {
      this.index = idx
      if (idx !== 2) {
        this.getData(idx)
      } else {
        this.getMyInviteData()
      }
    },
    getMyInviteData () {
      this.isLoading = true
      api.myInviteBoard().then(({data}) => {
        this.isLoading = false
        if (data.result === 1 && data.code === 0) {
          if (data.data.list.length > 0) {
            this.isHaveData = false
            this.myInviteInfo = data.data.me
            this.myInviteData = data.data.list
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
    background-image: url("../assets/images/invite-bg.jpg");
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 0 20px 30px;
    position: relative;
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
    &__btn{
      padding-top: 620px;
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
    &__step{
      width: 680px;
      min-height: 450px;
      max-width: 100%;
      background-color: #fff;
      border-radius: 24px;
      margin: 25px auto;
      padding: 30px;
      &__title{
        margin-bottom: 30px;
        color: #201a98;
        font: 34px 'Roboto', Arial, serif;
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
          .icon{
            flex: 1;
            align-self: center;
            margin-bottom: 20px;
            img{
              width: 115px;
              height: 120px;
              margin: 0 auto;
            }
          }
        }
        .num-img {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          justify-content: center;
          align-items: flex-start;
          margin-bottom: 15px;
          .num {
            flex: 1;
            align-self: center;
            img {
              width: 60px;
              height: 60px;
              margin: 0 auto;
            }
          }
        }
        .step-text {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #201a98;
          font: 24px 'Roboto', Arial, serif;
          .text{
            line-height: 30px;
            width: 90%;
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
          padding:20px;
          overflow-y: scroll;
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
