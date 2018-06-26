<template>
  <!-- 静态图片组件 -->
  <img :src="src" alt="">
</template>
<script>
import utils from '../assets/js/utils'
export default {
  name: 'static-image',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    src () {
      return utils.getImageUrl(this.name)
    }
  }
}
</script>
