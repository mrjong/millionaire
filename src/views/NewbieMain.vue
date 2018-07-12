 <template>
  <div class="main-container">
    <div class="main-container__top">
      <div class="main-container__top__back" @click="back">
        <p class="main-container__top__back__icon icon-fanhui iconfont"></p>
      </div>
      <div class="main-container__top__logo" @click="back">
        <img src="../assets/images/logo.png" alt="millionaire">
      </div>
      <lang class="main-container__top__lang"></lang>
      <div class="main-container__top__music" @click="isPlay">
        <img src="../assets/images/music-icon.png" v-if="isPlayingMusic">
        <img src="../assets/images/music_close-icon.png" v-else>
      </div>
    </div>
    <count-down></count-down>
    <!-- <respondence v-show="status === 3 && questionStatus !== 8"></respondence> -->
    <!-- <compere v-show="status === 3 && questionStatus === 8"></compere> -->
    <!-- <task-result></task-result> -->
    <!-- <balance-mark style="text-align:center;" v-if="showDialog" :data-info="dialogInfo" @okEvent='sure'></balance-mark> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
import CountDown from '../components/CountDown.vue'
import Respondence from '../components/Respondence'
import Compere from '../components/Compere'
import BalanceMark from '../components/BalanceMark'
import utils from '../assets/js/utils'
import lang from '../components/Language'
import TaskResult from '../components/TaskResult'
// import { _UPDATE, _INIT } from '../store/type'
export default {
  name: 'NewbieMain',
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
      isPlayingMusic: 'isPlayingMusic'
    })
  },
  created () {
    // if (this.status === 1) {
    //   this.$router.replace({path: '/'})
    // }
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
    }
  },
  components: {
    CountDown,
    Respondence,
    Compere,
    BalanceMark,
    lang,
    TaskResult
  }
}
</script>
<style scoped lang="less" type="text/less">
  .main-container{
    width: 100%;
    height:100%;
    background: url("../assets/images/main-bg.jpg") no-repeat top left;
    background-size: cover;
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
