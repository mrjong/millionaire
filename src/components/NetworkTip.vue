<template>
  <modal class="network-tip-wrap" :value="showTip">
    <section class="bg-reset network-tip" v-webp.bg="`url('network-tip-${lang}.png')`">
      <button class="enter" @click="close">{{$t('tip.networkNotice.btn')}}</button>
      <section class="close-btn">
        <img src="../assets/images/icon-fail-tip-close.png" @click="close">
      </section>
    </section>
  </modal>
</template>
<script>
import {mapGetters} from 'vuex'
import Modal from './Modal'
export default {
  name: 'NetworkTip',
  data () {
    return {
      showTip: this.value
    }
  },
  computed: {
    ...mapGetters(['lang'])
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.showTip = false
      this.$emit('close')
    }
  },
  components: {
    Modal
  },
  watch: {
    value (val) {
      this.showTip = val
    }
  }
}
</script>
<style lang="less" scoped>
  .network-tip {
    width: 547px;
    height: 696px;
    text-align: center;

    .enter {
      width: 480px;
      height: 70px;
      display: inline-block;
      font: 500 32px/1.4 'Roboto';
      color: #b35d00;
      background: linear-gradient(to bottom, #ffe092, #ffb953);
      border-radius: 100px;
      box-shadow: 0 7px 7px 4px rgba(0, 0, 0, .3);
      margin-top: 104%;
      outline: none;
    }

    .close-btn {
      width: 64px;
      height: 64px;
      display: inline-block;
      transform: translateY(103px);

      img {
        width: 100%;
      }
    }
  }
</style>
