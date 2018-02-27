<template>
  <div class="balance-wrap">
    <div class="balance-wrap__title">
      <p class="balance-wrap__title__back"></p>
      <p class="balance-wrap__title__nickname">{{userInfo.userName}}</p>
    </div>
    <div class="balance-wrap__contain">
      <div class="balance-wrap__contain__wrap">
        <img :src="userInfo.avatar" alt="" class="balance-wrap__contain__wrap__img">
        <p class="balance-wrap__contain__wrap__mytitle">My balance</p>
        <p class="balance-wrap__contain__wrap__mybalance">
          {{userInfo.currencyType}}5.8<span class="balance-wrap__contain__wrap__tip">(over 20 yuan can be withdrawn)</span>
        </p>
        <p class="balance-wrap__contain__wrap__totaltitle">Total revenue</p>
        <p class="balance-wrap__contain__wrap__totalbalance">{{userInfo.currencyType}}5267.8</p>
      </div>
    </div>
    <div class="balance-wrap__operate">
      <input type="text" class="balance-wrap__operate__input" placeholder="PayTM Account">
      <p class="balance-wrap__operate__tip">Please enter your paytm account,we will be in the review,will be up to 15 working days to make money to you.</p>
      <p class="balance-wrap__operate__btn">Cash Out</p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Balance',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  }
}
</script>
<style scoped lang="less" type="text/less">
.balance-wrap {
  width: 100%;
  height: 100%;
  background: url('../assets/images/balance-bg.jpg') no-repeat top left;
  padding: 0 25px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &__title {
    width: 100%;
    height: 54px;
    margin: 24px 0;
    box-sizing: border-box;
    font-size: 28px;
    font-family: 'Roboto-Medium';
    color: #fff;
    display: flex;
    align-items: center;
    &__back {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .2);
    }
    &__nickname {
      width: 100%;
      text-align: center;
      flex: 1;
    }
  }
  &__contain {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 384px;
    &__wrap {
      width: 100%;
      min-height: 384px;
      background: #fff;
      border-radius: 24px;
      padding: 64px;
      box-sizing: border-box;
      position: relative;
      color: #241262;
      &__img {
        position: absolute;
        width: 103px;
        height: 103px;
        border-radius: 50%;
        top: -51px;
        right: 55px;
      }
      &__mytitle, &__totaltitle {
        font-size: 28px;
        font-family: 'Roboto-Light'
      }
      &__mybalance, &__totalbalance {
        font-size: 52px;
        font-family: 'Roboto-BoldCondensed';
        margin: 20px 0 58px 0;
      }
      &__totalbalance {
        margin: 20px 0 0px 0;
      }
      &__tip {
        font-size: 26px;
        font-family: 'Roboto-Light';
        color: #7B7B7B;
        margin-left: 22px;
      }
    }
  }
  &__operate {
    width: 100%;
    height: 314px;
    margin-bottom: 85px;
    &__input {
      width: 100%;
      height: 94px;
      background: #fff;
      border-radius: 16px;
      border: none;
      outline: none;
      color: #241262;
      font-size: 34px;
      font-family: 'Roboto-Light';
      text-align: center;
      line-height: 94px;
    }
    &__input::-webkit-input-placeholder{
      color: #9F9EA1;
    }
    &__input:-ms-input-placeholder{
      color: #9F9EA1;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
    }
    &__input::-moz-placeholder{
      color: #9F9EA1;
    }
    &__tip {
      width: 100%;
      color: #fff;
      font-family: 'Roboto-Light';
      font-size: 24px;
      line-height: 30px;
      margin: 27px 0 39px 0;
    }
    &__btn {
      width: 100%;
      height: 94px;
      border-radius: 46px;
      color: #fff;
      background: RGB(250,167,23, 0.95);
      text-align: center;
      line-height: 94px;
      font-size: 28px;
      font-family: 'Roboto-Light';
    }
  }
}
</style>
