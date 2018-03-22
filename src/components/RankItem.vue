<template>
  <!-- 排行榜列表项组件 lixuan@apusapps.com -->
  <div class="rank-item flex-box" :class="['rank-item', 'flex-box', isSelf ? 'self' : '']">
    <p class="rank-item_index">{{rank > 0 ? rank : '-'}}</p>
    <section class="rank-item_info flex-box flex-align-center">
      <img class="avatar" :src="avatar" alt="">
      <span class="name ellipsis-1">{{name}}</span>
      <span class="money" v-if="isInList">{{currencyType}}{{amount}}</span>
      <span class="notInList" v-else>Not on the list</span>
    </section>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'rank-item',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['currencyType'])
  },
  props: {
    rank: {
      type: Number, // 排名
      default: 0
    },
    avatar: {
      type: String, // 头像
      default: ''
    },
    name: {
      type: String, // 姓名
      default: ''
    },
    amount: {
      type: Number, // 金额
      default: 0
    },
    isSelf: { // 是否为自己的排名 是则加特殊样式
      type: Boolean,
      default: false
    },
    isInList: { // 是否在榜单中
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
      width: 15.64%;
      height: 100%;
      text-align: center;
      color: #241262;
      font: 400 28px/92px 'Roboto Condensed', Arial, serif;
    }

    &_info {
      flex: 1;
      border-bottom: 1px solid rgba(36, 18, 98, .08);
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 60px;
      }
      .name {
        font: 300 28px 'Roboto', Arial, serif;
        color: #241262;
        margin-left: 31px;
        max-width: 330px;
      }
      .money, .notInList {
        font: 400 24px/92px 'Roboto Condensed', Arial, serif;
        color: #ffb227;
        position: absolute;
        right: 2%;
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
