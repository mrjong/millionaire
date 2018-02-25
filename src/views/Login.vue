<template>
  <div class="login-container">
    <div class="login-container__btn">
      <a href="" class="login-container__btn__fb">
        <img src="../assets/images/login-fb.png" alt="facebook">
        <i>Facebook</i>
      </a>
      <a href="" class="login-container__btn__google">
        <img src="../assets/images/login-google.png" alt="google+">
        <i>Google+</i>
      </a>
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
    &__btn{
      position: absolute;
      bottom: 6%;
      &__fb, &__google{
        display: block;
        margin: 1.5rem auto 0;
        text-align: center;
        position: relative;
        img{
          width: 90%;
          margin: 0 auto;
        }
        i{
          font-style: normal;
          display: block;
          color: #ffffff;
          font-size: 36px;
          font-family: Roboto-Light,serif;
        }
      }
    }
  }
</style>
