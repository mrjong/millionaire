<template>
  <div class="invite bg-reset" v-webp.bg="`url('invite-bg.jpg')`">
    <p class="invite__back icon-fanhui iconfont" @click="back"></p>
    <p class="invite__rule" @click="rule">{{$t('invite.rule_bnt')}}</p>
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
      <p class="invite__step__title">{{$t('invite.steps_title')}} <span class="icon-shuoming iconfont instruct" @click="instruct"></span></p>
      <div class="invite__step__content">
        <div class="icon-img">
          <span class="icon-youjiantou iconfont arrows1"></span>
          <span class="icon-youjiantou iconfont arrows2"></span>
          <div class="icon" v-for="i in 3" :key="i">
            <img v-webp="`coin${i}.png`">
          </div>
        </div>
        <div class="num-money">
          <p class="text" v-for="i in 3" :key="i">+ {{userInfo.currencyType}} {{i === 3? 40 : 10*i}}</p>
        </div>
        <div class="step-text">
          <p class="text" v-for="i in 3" :key="i">{{$t('invite.invite_times',{'times': i*i})}}</p>
        </div>
      </div>
      <div class="invite__step__btn">{{$t('invite.invite_hint')}}</div>
    </div>
    <div class="invite__mytask">
      <p class="invite__mytask__title">{{$t('invite.invite_task')}}</p>
      <div class="invite__mytask__content">
        <div class="icon-img">
          <span class="icon-youjiantou iconfont arrows1"></span>
          <span class="icon-youjiantou iconfont arrows2"></span>
          <div class="progress-ball" v-for="i in 3" :key="i">
            <span class="total-money" :class=" `progress${i}`">{{myInviteNum && myInviteNum['a' + i] ? myInviteNum['a' + i] : 0}} x {{userInfo.currencyType}}{{i === 3? 40 :10*i}}</span>
            <img v-webp="`progress${i}.png`">
          </div>
        </div>
        <div class="num-money">
          <p class="text" v-for="i in 3" :key="i">{{$t('invite.invite_friend', {'num': myInviteNum && myInviteNum['a' + i] ? myInviteNum['a' + i] : 0})}}</p>
        </div>
        <div class="step-text">
          <p class="text" v-for="(val, idx) in 3" :key="idx">{{$t('invite.invite_times', {'times': val*val})}}</p>
        </div>
      </div>
    </div>
    <!-- <div class="invite__rewards">
      <p class="invite__rewards__title">{{$t('invite.steps_title')}}</p>
      <div class="invite__rewards__content">
        <div class="icon-img reward-icon" >
          <div class="icon" v-for="i in 3" :key="i">
            <img src="../assets/images/coin-icon.png">
            <span class="text">+ 100</span>
          </div>
        </div>
        <div class="rewards-text">
          <p class="text" v-for="(val, idx) in $t('invite.rewards')" :key="idx">{{val}}</p>
        </div>
      </div>
    </div> -->
    <div class="invite__list">
      <div class="tap">
        <p class="title" @click="changeTap(idx)" :class="{'tap-active': idx === index}" v-for="(val, idx) in tap" :key="idx">{{val}}</p>
      </div>
      <div class="content3" v-if="index === 0">
        <div class="my-invite" v-if="myInviteData.length > 0">
          <div class="my-info bg-reset bg-center" v-webp.bg="`url('invite-user-bg.png')`" v-if="myInviteInfo">
            <img :src="myInviteInfo.upic" class="head">
            <p class="nickname">{{myInviteInfo.nick}}</p>
            <p class="number">{{$t('invite.rank_text1', {number: myInviteInfo.pc})}}</p>
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
                <p class="date">{{$t('invite.invite_times', {'times': val.an ? val.an: 0})}}</p>
              </div>
              <div class="invite-data">
                <p class="money" v-if="val.type === 4">
                  <span :class="{'gray': val.status === 0}">+{{userInfo.currencyType}}{{val.amountFmt}}</span>
                </p>
                <p class="money" v-else>
                  <span v-for="i in 3" :key="i" class="gray" :class="{'active':val[`type${i-1}`] === (i === 1 ? 0: (i === 2 ? 2 : 3)) && val[`status${i - 1}`] === 1}"> +{{userInfo.currencyType}}{{val[`amount${i-1}Fmt`]}}</span>
                </p>
                <p class="number invite-name" v-if="val.type === 4">{{val. pnick}}</p>
                <p class="number" @click="copy" v-else>{{$t('invite.invite_copy')}}</p>
              </div>
            </div>
            <div class="more-button" @click="getMoreInvite" v-if="isShowMoreBtn">{{$t('invite.get_more')}}</div>
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
    <p class="copyright">{{$t('invite.copyright')}}</p>
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
        htmlTitle: '',
        htmlText: '',
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
      myInviteNum: {},
      isHaveData: false,
      isLoading: false,
      isShowMoreBtn: true,
      offset: 0,
      limit: 10,
      isCopy: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    utils.statistic('invite_earn_page', 0)
    this.getMyInviteData('change')
    this.myInviteTask()
  },
  methods: {
    getMoreInvite () {
      this.getMyInviteData()
    },
    back () {
      this.$router.go(-1)
    },
    instruct () {
      this.showDialog = true
      this.dialogInfo.htmlTitle = this.$t('invite.rule_bnt')
      this.dialogInfo.okBtnText = this.$t('tip.lateJoin.btn')
      this.dialogInfo.htmlText = `
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.task_rule[0]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.task_rule[1]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.task_rule[2]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.task_rule[3]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.task_rule[4]')}</p>`
    },
    rule () {
      this.showDialog = true
      this.dialogInfo.htmlTitle = this.$t('invite.rule_bnt')
      this.dialogInfo.okBtnText = this.$t('tip.lateJoin.btn')
      this.dialogInfo.htmlText = `<p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[0]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[1]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[2]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[3]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[4]')}</p>
      <p style="text-align: left;line-height: 0.4rem;">${this.$t('invite.rule[5]')}</p>`
    },
    copy () {
      utils.statistic('help_active_buttion', 1)
      this.showDialog = true
      this.dialogInfo.htmlTitle = this.$t('invite.copy_tip.hint')
      this.dialogInfo.htmlText = `<p class="copy">${this.$t('invite.copy_tip.content', {'money': this.myInviteInfo.amountFmt})}</p>`
      this.dialogInfo.okBtnText = this.$t('invite.copy_tip.btn')
      this.isCopy = true
    },
    changeTap (idx) {
      this.index = idx
      if (idx !== 0) {
        this.getData(idx)
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
      if (index === 1) {
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
      } else if (index === 2) {
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
    myInviteTask () {
      api.myInviteTask().then(({data}) => {
        if (data.result === 1 && data.code === 0 && data.data) {
          this.myInviteNum = data.data
        }
      }).catch()
    },
    shareClose () {
      this.reviveObj.isShare = false
    },
    // 弹框ok
    okEvent (a, b) {
      this.showDialog = false
      if (this.isCopy) {
        this.isCopy = false
        // 复制一段话
        let input = document.createElement('input')
        input.value = this.$t('invite.copy_tip.content', {'money': this.myInviteInfo.amountFmt})
        document.body.appendChild(input)
        input.select()
        input.setSelectionRange(0, input.value.length)
        document.execCommand('Copy')
        document.body.removeChild(input)
      }
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
      border-top-left-radius: 50px 50px;
      border-bottom-left-radius: 50px 50px;
      padding-left: 10px;
    }
    &__title {
      width: 620px;
      margin: 0 auto 220px;
      padding-top: 50px;
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
      padding: 30px 0;
      &__title{
        width: 90%;
        margin: 0 auto 30px;
        color: #201a98;
        font:600 32px 'Roboto', Arial, serif;
        text-align: center;
        .instruct{
          color: #201a98;
          font-size: 28px;
        }
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
            overflow: hidden;
            position: relative;
            img{
              width: 100%;
              height: 100%;
            }
            .total-money{
              width: 100%;
              position: absolute;
              left: 50%;
              transform: translate(-50%, 0);
              color: #fa8d36;
              font: 600 28px 'Roboto', Arial, serif;
              text-align: center;
            }
            .progress1{
              top: 50%;
              transform: translate(-50%,-50%)
            }
            .progress2{
              top: 20%;
              transform: translate(-50%,0)
            }
            .progress3{
              top: 20%;
              transform: translate(-50%,0);
              color:#fff;
            }
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
        width: 600px;
        padding: 24px;
        font: 400 24px "Roboto", Arial, serif;
        text-align: center;
        color: #fff;
        border-radius:12px;
        background:linear-gradient(left, #f6cd46 , #fc642b);
        background:-webkit-linear-gradient(left, #f6cd46 , #fc642b);
        margin: 45px auto 0;
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
            background-color: #fb7730;
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
            border-bottom: 1px solid rgba(34,15,96,0.1);
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
                min-width: 125px;
                max-width: 180px;
                font: 24px 'Roboto', Arial, serif;
                height: 40px;
                line-height: 43px;
                margin-top: 10px;
                text-align: center;
                background-color: #ffb03e;
                color: #fff;
                border-radius: 24px;
                padding: 0 20px;
              }
              .invite-name{
                background-color: #ff93ba;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .money {
                height: 40px;
                font: 24px 'Roboto', Arial, serif;
                line-height: 20px;
                text-align: right;
                color:#ffb03e;
                .gray {
                  color:#d9d4cd;
                }
                .active{
                  color:#ffb03e;
                }
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
    .copyright{
      color: #fff;
      text-align: center;
      font: 24px 'Roboto', Arial, serif;
    }
  }
</style>
