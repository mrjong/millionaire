<template>
  <!-- 静态图片组件 -->
  <img :src="src" :alt="alt">
</template>
<script>
import utils from '../assets/js/utils'
export default {
  name: 'static-image',
  props: {
    name: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    extra: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    src () {
      return utils.getStaticImgUrl(this.name, this.width, this.height, this.extra)
    }
  }
}
</script>
