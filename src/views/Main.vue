 <template>
  <div class="main-container">
    <div class="main-container__top">
      <div class="main-container__top__online">
        <p class="main-container__top__online__icon icon-yonghu iconfont"></p>
        <p class="main-container__top__online__num">{{onlineAmount}}</p>
      </div>
      <div class="main-container__top__logo">
        <img src="../assets/images/logo.png" alt="millionaire">
      </div>
    </div>
    <count-down v-if="status === 2"></count-down>
    <winners-result v-if="status === 4"></winners-result>
    <respondence @error="onError" v-show="status === 3 && questionStatus !== 8"></respondence>
    <compere v-show="status === 3 && questionStatus === 8"></compere>
    <chat-room></chat-room>
    <balance-mark style="text-align:center;" v-if="showDialog" :data-info="dialogInfo" @okEvent='sure'></balance-mark>
    <login-tip v-if="showLogin" desp="Landing Answer Win Bonus"></login-tip>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ChatRoom from '../components/ChatRoom'
import CountDown from '../components/CountDown.vue'
import Respondence from '../components/Respondence'
import WinnersResult from '../components/WinnersResult'
import Compere from '../components/Compere'
import BalanceMark from '../components/BalanceMark'
import LoginTip from '../components/LoginTip'
import * as type from '../store/type'
import utils from '../assets/js/utils'
export default {
  name: 'Main',
  data () {
    return {
      showDialog: false,
      dialogInfo: {
        htmlTitle: 'Failed to Submit',
        htmlText: '',
        shouldSub: false,
        markType: 0,
        okBtnText: 'OK',
        hintImg: 'http://static.subcdn.com/201803261933287074f92538.png'
      }
    }
  },
  computed: {
    ...mapGetters({
      onlineAmount: 'onlineAmount',
      status: 'status',
      questionStatus: 'question_status',
      isWon: 'isWon'
    }),
    showLogin () {
      return this.isWon && !utils.isOnline && utils.clientId
    }
  },
  mounted () {},
  methods: {
    sure () {
      this.showDialog = false
    },
    onError (err) {
      this.dialogInfo.htmlText = err
      this.showDialog = true
      setTimeout(() => {
        this.showDialog = false
      }, 1000)
    },
    init () {
      this.$store.dispatch(type.GET_COMPERE_MESSAGE_ACTION)
      this.$store.dispatch(type.QUESTION_INIT)
      this.$store.dispatch(type._UPDATE_AMOUNT)
      this.$store.dispatch(type._RECEIVE_RESULT)
      this.$store.dispatch(type._END)
    }
  },
  created () {
    this.init()
  },
  components: {
    CountDown,
    ChatRoom,
    Respondence,
    WinnersResult,
    Compere,
    BalanceMark,
    LoginTip
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
      width: 100%;
      display: flex;
      padding: 25px 25px 0;
      justify-content: space-between;
      min-height: 59px;
      &__online{
        padding: 0 18px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 26px;
        display: flex;
        align-items: center;
        align-self: center;
        height: 52px;
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
        align-self: center;
        img{
          width: 135px;
        }
      }
    }
  }
</style>
