<template>
  <div class="rank-item flex-box" :class="{self: isSelf}">
    <p class="rank-item_index">1333</p>
    <section class="rank-item_info flex-box flex-align-center">
      <img class="avatar" src="http://images.apusapps.com/src/icon-apus-user-system.png" alt="">
      <span class="name">Cristina</span>
      <span class="money" v-if="isInList">$100.34</span>
      <span class="notInList" v-else>Not on the list</span>
    </section>
  </div>
</template>
<script>
export default {
  name: 'rank-item',
  data () {
    return {
    }
  },
  props: {
    isSelf: {
      type: Boolean
    },
    isInList: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="less" scoped>
  .rank-item {
    width: 100%;
    padding-right: 3.7%;
    height: 92px;
    position: relative;

    &_index {
      width: 21.64%;
      height: 100%;
      text-align: center;
      font: normal 28px/92px "Myriad Pro", "Roboto";
    }

    &_info {
      flex: 1;
      border-bottom: 1px solid #e4e1eb;
      .avatar {
        width: 60px;
        height: 60px;
      }
      .name {
        font: normal 28px "Roboto-Light";
        color: #3e2e75;
        margin-left: 8.5%;
      }
      .money, .notInList {
        font: normal 24px "RobotoCondensed Regular";
        line-height: 92px;
        color: #ffb227;
        position: absolute;
        right: 0;
      }

      .notInList {
        color: #241262;
      }
    }
  }

  .self {
    background-color: #ffe4aa;
    border: none;
  }
</style>
