 <template>
  <div class="main-container">
    <div class="main-container__top">
      <div class="main-container__top__back" @click="back">
        <p class="main-container__top__back__icon icon-fanhui iconfont"></p>
      </div>
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
export default {
  name: 'Main',
  data () {
    return {
      showLogin: false,
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
    })
  },
  mounted () {},
  methods: {
    sure () {
      this.showDialog = false
    },
    back () {
      this.$router.push({path: '/'})
    },
    onError (err) {
      this.dialogInfo.htmlText = err
      this.showDialog = true
      setTimeout(() => {
        this.showDialog = false
      }, 1000)
    }
  },
  components: {
    CountDown,
    ChatRoom,
    Respondence,
    WinnersResult,
    Compere,
    BalanceMark
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
      min-height: 59px;
      &__back{
        width: 54px;
        height: 54px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 26px;
        line-height: 54px;
        text-align: center;
        margin-right: 15px;
      }
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
        flex: 5;
        position: relative;
        img{
          width: 135px;
          text-align: right;
          position: absolute;
          right: 0;
        }
      }
    }
  }
</style>
