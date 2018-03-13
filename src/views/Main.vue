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
    <respondence v-if="status === 3 && questionStatus !== 8"></respondence>
    <compere v-if="status === 3 && questionStatus === 8"></compere>
    <chat-room></chat-room>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ChatRoom from '../components/ChatRoom'
import CountDown from '../components/CountDown.vue'
import Respondence from '../components/Respondence'
import WinnersResult from '../components/WinnersResult'
import Compere from '../components/Compere'
export default {
  name: 'Main',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      onlineAmount: 'onlineAmount',
      status: 'status',
      questionStatus: 'question_status'
    })
  },
  mounted () {
  },
  methods: {
  },
  components: {
    CountDown,
    ChatRoom,
    Respondence,
    WinnersResult,
    Compere
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
      &__online{
        padding: 18px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 26px;
        display: flex;
        align-items: center;
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
        width: 168px;
        align-self: center;
        img{
         width: 100%;
        }
      }
    }
  }
  .respondence {
    width: 100%;
    height: 785px;
  }
  .chat-global-mark {
    width: 100%;
    height: 89%;
    background: url('../assets/images/chat-mark.png') no-repeat top left;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
