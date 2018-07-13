<template>
  <div class="double-reward-card">
    <div class="double-reward-list">
      <div class="double-reward-list_item"
      v-for="user in userList"
      :key="user.userId"
      >
        <div class="item_pic"><img :src="user.userPic" alt=""></div>
        <div class="item_name ellipsis-1">{{user.userName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {doubelRewardList} from '../assets/js/api.js'

export default {
  name: 'DoubleRewardCard',
  data () {
    return {
      userList: [
      ]
    }
  },
  mounted () {
    doubelRewardList().then(({data}) => {
      if (data.result === 1 && data.code === 0) {
        this.userList = data.data.map(item => {
          let obj = {}
          obj.userName = item.un
          obj.userPic = item.up
          obj.userId = item.ud
          return obj
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
.double-reward {
  &-card {
    width: auto;
    height: 1681px;
    background-image: url('../assets/images/double-reward-bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    padding: 1200px 30px 0;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 660px;
    height: 480px;
    background-color: rgba(255,255,255, .16);
    border-radius: 10px;
    padding: 10px 30px 0;
    overflow-y: scroll;
  }

  &-list_item {
    width: 50%;
    line-height: 100px;
    margin-bottom: 35px;

    .item_pic {
      float: left;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .item_name {
      color: #fff;
      max-width: 100px;
      float: left;
    }

  }
}
</style>
