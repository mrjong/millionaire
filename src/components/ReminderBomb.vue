<template>
  <div class="mark" v-if="isReminderPop" @click="showCountryList = false">
    <div class="wrap">
    <span class="cancel iconfont icon-cuowu" @click="close"></span>
    <p class="hint-icon">
      <img src="../assets/images/reminder-icon.png" class="hint-icon__img">
    </p>
    <p class="title">{{$t('await.set_reminder_btn')}}</p>
    <div class="national-code" @click.stop="showCountryList = !showCountryList">
      <span class="iconfont icon-guojia code-icon"></span>
      <span class="iconfont icon-LIVINGyoujiantou drop-down"></span>
      <p class="invitation">{{phoneNationCode.country}}{{ ' +' + phoneNationCode.code}}</p>
    </div>
    <div class="phone">
      <span class="iconfont icon-shouji phone-icon"></span>
      <input type="text"
          :placeholder="$t('await.reminder_phone')"
          class="invitation"
          v-model="reminderObj.phone">
    </div>
    <div class="is-reminder">
      <p class="checkbox">
        <label for="yes" class="iconfont" :class="{'selected icon-duigou': type}"></label>
        <input type="checkbox" id="yes" v-model="type" name="option">
      </p>
      <p class="">{{$t('await.remider_tip')}}</p>
    </div>
    <p class="btn">
      <span class="btn__ok" @click="okEvent">OK</span>
    </p>
    </div>
    <country-list v-model="showCountryList"></country-list>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import CountryList from './CountryList'
export default {
  name: 'ReminderBomb',
  props: {
    isReminderPop: {
      type: Boolean
    }
  },
  data () {
    return {
      reminderObj: {
        nation_code: '',
        phone: '',
        type: false
      },
      type: false,
      isReminderMark: true,
      showCountryList: false
    }
  },
  computed: {
    ...mapGetters(['status', 'phoneNationCode'])
  },
  methods: {
    okEvent () {
      this.reminderObj.nation_code = this.phoneNationCode.code
      this.reminderObj.type = (this.type === true ? 0 : 1)
      this.$emit('ReminderOk', this.reminderObj)
    },
    close () {
      this.$emit('ReminderClose')
    }
  },
  components: {
    CountryList
  }
}
</script>
<style scoped lang="less" type="text/less">
  .mark{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left: 0;
    background: rgba(0, 0,0, 0.8);
  }
  .wrap {
    max-width: 85%;
    width: 602px;
    background: #fff;
    border-radius: 16px;
    padding: 40px 45px;
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .cancel{
      width: 50px;
      height: 50px;
      border: 3px solid #f7f6f7;
      position: absolute;
      top: 20px;
      right: 20px;
      color:#241262;
      line-height: 45px;
      text-align: center;
      border-radius: 50%;
    }
    .hint-icon{
      width: 100px;
      margin:0 auto 26px;
      &__img{
        width: 100%;
      }
    }
    .is-reminder {
      display: flex;
      justify-content: center;
      input{
        opacity: 0;
      }
      label{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        font-weight: 100;
      }
      .selected{
        color: #241262;
      }
      .checkbox{
        width: 30px;
        height: 30px;
        text-align: center;
        font-size: .15px;
        color: #241262;
        line-height: 38px;
        box-shadow: 0 0 0 2px #241262;
        border-radius: 5px;
        align-self: center;
      }
      p{
        height: 30px;
        margin-left: 20px;
        font: 26px 'Roboto', Arial, serif;
        line-height: 30px;
        color: #241262;
      }
    }
    .title {
      width: 100%;
      font: 32px/30px 'Roboto', Arial, serif;
      color: #000;
      min-height: 40px;
      margin: 10px auto;
      text-align: center;
    }
    .phone, .national-code{
      position: relative;
      margin: 20px 0;
    }
    .phone-icon, .code-icon{
      position: absolute;
      top: 50%;
      left: 30px;
      transform: translate(0,-50%);
      color: #241262;
      font-size: 42px;
    }
    .drop-down{
      position: absolute;
      top: 50%;
      right: 30px;
      transform: translate(0,-50%) rotateZ(90deg);
      color: #241262;
      font-size: 32px;
    }
    .invitation{
      width: 100%;
      height: 77px;
      line-height: 77px;
      border-radius: 46px;
      background-color:#f4f3f7 ;
      border: 0;
      padding-left: 30px;
      color:#241262 ;
      font-size: 28px;
      text-align: center;
    }
    input::-webkit-input-placeholder{
      width: 100%;
      color: #241262;
      opacity: 0.6;
      text-align: center;
      font-size: 28px;
    }
    .btn {
      width: 100%;
      height: 77px;
      display: flex;
      justify-content: space-around;
      margin-top: 25px;
      span {
        display: inline-block;
        width: 240px;
        height: 100%;
        border-radius: 38px;
        color: #fff;
        font: 300 28px 'Roboto', Arial, serif;
        text-align: center;
        line-height: 77px;
      }
      &__ok {
        background: rgba(250, 167, 23, 0.95);
      }
    }
  }
</style>
