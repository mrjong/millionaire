<template>
  <div class="login-container">
    <img src="../assets/images/login-title.png" class="login-container__title">
    <div class="login-container__btn">
      <a href="" class="login-container__btn__fb" @click="FbLogin">Facebook</a>
      <a href="" class="login-container__btn__google" @click="GoogleLogin">Google+</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {}
  },
  methods: {
    // 登录方法
    FbLogin () {},
    GoogleLogin () {}
  },
  mounted () {}
}
</script>
<style scoped lang="less" type="text/less">
  .login-container{
    width: 100%;
    height: 100%;
    background: url("../assets/images/login-bg.jpg") no-repeat center;
    background-size: cover;
    position: relative;
    &__title{
      padding-top: 120px;
      width: 592px;
      margin: 0 auto;
    }
    &__btn{
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translate(-50%);
      text-align: center;
      &__fb, &__google{
        display: block;
        width: 658px;
        height: 94px;
        line-height: 94px;
        text-align: center;
        color: #ffffff;
        font-size: 36px;
        background-color: #4C08F3;
        opacity: 0.95;
        border-radius: 46px;
        margin: 0 auto;
      }
      &__google{
        margin-top: 32px;
        background-color: #DC427A;
      }
    }
  }
</style>
