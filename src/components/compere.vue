<template>
  <div class="compere-container">
    <p class="compere-container__text">
      <!-- Your are really smart Your are really smart Your are really smart Your are really smart Your are really smart Your are really smart Your are really smart -->
      {{compereMsg}}
    </p>
    <img src="../assets/images/supa.png" alt="" class="compere-container__supa">
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
export default {
  name: 'Compere',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      compereMsg: 'compereMsg'
    })
  },
  mounted () {
    this.$store.dispatch(type.GET_COMPERE_MESSAGE_ACTION)
  }
}
</script>
<style scoped lang="less" type="text/less">
.compere-container {
  box-sizing: border-box;
  margin: 25px;
  background-color: #fff;
  border-radius: 28px;
  padding: 222px 43px 0px 53px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__text {
    font-size: 22px;
    color: #241262;
    font-family: 'Roboto Medium';
    margin: 0 10px 32px 0;
    text-indent: 44px;
  }
  &__supa {
    width: 109px;
  }
}
</style>
