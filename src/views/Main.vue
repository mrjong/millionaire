 <template>
  <div class="main-container bg-reset" v-webp.bg="`url('main-bg.jpg')`">
    <div class="main-container__top">
      <div class="main-container__top__back" @click="back">
        <p class="main-container__top__back__icon icon-fanhui iconfont"></p>
      </div>
      <div class="main-container__top__online">
        <p class="main-container__top__online__icon icon-yonghu iconfont"></p>
        <p class="main-container__top__online__num">{{onlineAmount}}</p>
      </div>
      <div class="main-container__top__logo" @click="back">
        <img v-webp="'logo.png'" alt="millionaire">
      </div>
      <lang class="main-container__top__lang" v-if="!isTaskRespondence"></lang>
      <div class="main-container__top__music" @click="isPlay">
        <img src="../assets/images/music-icon.png" v-if="isPlayingMusic">
        <img src="../assets/images/music_close-icon.png" v-else>
      </div>
    </div>
    <count-down v-if="status === 2"></count-down>
    <winners-result v-if="status === 4 && !isTaskRespondence"></winners-result>
    <keep-alive>
      <component v-bind:is="anwseredComponent" @fail-tip="failTip" @error="onError"></component>
    </keep-alive>
    <!-- <respondence @fail-tip="failTip" @error="onError" v-if="status === 3 && questionStatus !== 8 && !isTaskRespondence"></respondence> -->
    <!-- <task-respondence v-show="status === 3 && questionStatus !== 8 && isTaskRespondence"></task-respondence> -->
    <compere v-show="status === 3 && questionStatus === 8"></compere>
    <chat-room v-if="!isTaskRespondence"></chat-room>
    <task-result v-if="status === 3 && isShowTaskEnd"></task-result>
    <bouns-tip v-if="hasBounsBox && isOnline"></bouns-tip>
    <!-- <new-announcement v-if="status === 2"></new-announcement> -->
    <balance-mark style="text-align:center;" v-if="showDialog" :data-info="dialogInfo" @okEvent='sure'></balance-mark>
    <fail-tip-modal v-model="showFailTip" :index="index" @close="showFailTip = false"></fail-tip-modal>
    <watching-mode-tip></watching-mode-tip>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
import FailTipInvite from '../components/FailTipInvite'
import FailTipModal from '../components/FailTipModal'
import ChatRoom from '../components/ChatRoom'
import CountDown from '../components/CountDown.vue'
import Respondence from '../components/Respondence'
import TaskRespondence from '../components/TaskRespondence'
import WinnersResult from '../components/WinnersResult'
import Compere from '../components/Compere'
import BalanceMark from '../components/BalanceMark'
import utils from '../assets/js/utils'
import lang from '../components/Language'
import TaskResult from '../components/TaskResult'
import WatchingModeTip from '../components/WatchingModeTip.vue'
import BounsTip from '../components/BounsTip'
// import NewAnnouncement from '../components/NewAnnouncement'
// import { _UPDATE, _INIT } from '../store/type'
export default {
  name: 'Main',
  data () {
    return {
      showLogin: false,
      showDialog: false,
      showFailTip: false,
      index: 1, // 题目序号
      dialogInfo: {
        htmlTitle: this.$t('tip.failtosubmit.title'),
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: this.$t('tip.failtosubmit.btn'),
        hintImg: '//static.apusapps.com/201803261933287074f92538.png'
      }
    }
  },
  computed: {
    ...mapGetters({
      onlineAmount: 'onlineAmount',
      status: 'status',
      questionStatus: 'question_status',
      isWon: 'isWon',
      isPlayingMusic: 'isPlayingMusic',
      isShowTaskEnd: 'isShowTaskEnd',
      isTaskRespondence: 'isTaskRespondence',
      hasBounsBox: 'hasBounsBox',
      isOnline: 'isOnline'
    }),
    anwseredComponent () {
      if (this.status === 3 && this.questionStatus !== 8 && !this.isTaskRespondence) {
        return Respondence
      } else if (this.status === 3 && this.questionStatus !== 8 && this.isTaskRespondence) {
        return TaskRespondence
      }
    }
  },
  created () {
    if (this.status === 1) {
      this.$router.replace({path: '/'})
    }
  },
  mounted () {},
  methods: {
    sure () {
      this.showDialog = false
    },
    back () {
      this.$router.replace({path: '/'})
    },
    onError (err) {
      if (typeof err === 'string') {
        this.dialogInfo.htmlText = err
      } else {
        this.dialogInfo = {...this.dialogInfo, ...err}
      }
      this.showDialog = true
      setTimeout(() => {
        this.showDialog = false
      }, 10000)
    },
    isPlay () {
      if (!this.isPlayingMusic) {
        this.$store.commit(type._UPDATE, {
          isPlayingMusic: true
        })
        utils.playSound('bg')
      } else {
        this.$store.commit(type._UPDATE, {
          isPlayingMusic: false
        })
        utils.stopSound()
      }
    },
    /*
    * 失败提示
    */
    failTip () {
      this.index = this.$store.getters.index || 1
      this.showFailTip = true
    }
  },
  components: {
    CountDown,
    ChatRoom,
    Respondence,
    WinnersResult,
    Compere,
    BalanceMark,
    FailTipInvite,
    lang,
    TaskResult,
    TaskRespondence,
    FailTipModal,
    WatchingModeTip,
    BounsTip
  }
}
</script>
<style scoped lang="less" type="text/less">
  .main-container{
    width: 100%;
    height:100%;
    display: flex;
    flex-direction: column;
    position: relative;
    &__top{
      height: 85px;
      display: flex;
      align-items: center;
      padding: 25px 25px 0;
      position: relative;
      &__back {
        width: 54px;
        height: 54px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 26px;
        line-height: 54px;
        text-align: center;
        margin-right: 15px;
        color: #fff;
        font-family: 'Roboto', Arial, serif;
        &__icon {
          font-size: 24px;
        }
      }
      &__lang {
        position: absolute;
        right: 93px;
        font-size: 26px;
      }
      &__online{
        padding: 0 18px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 26px;
        display: flex;
        align-items: center;
        align-self: center;
        height: 52px;
        position: relative;
        &__icon{
          width: 24px;
          height: 24px;
          font-size: 24px;
          line-height: 24px;
          align-self: center;
          margin-right: 12px;
        }
        &__num{
          font-size: 24px;
          color: #fff;
          align-self: center;
        }
      }
      &__logo{
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        img{
          width: 135px;
        }
      }
      &__music{
        width: 54px;
        height: 54px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 26px;
        line-height: 54px;
        text-align: center;
        margin-right: 25px;
        font-size: 24px;
        position: absolute;
        right:0;
        img{
          width: 60%;
          margin: 10px auto 0;
        }
      }
    }
  }
</style>
