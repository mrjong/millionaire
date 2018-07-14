<template>
  <div class="double-reward-card">
    <BackArrow class="double-reward-card__back"></BackArrow>
    <div class="double-reward-rule">
      <h2>HOW TO USE</h2>
      <p>1. Double Prize Cards are only available after you won more than once at 10PM before today.</p>
      <p>2. With it, you prize will double after you win at the 10PM game in 3 days.</p>
      <p>3. A 'Doube Prize Card' can only be used after login, and it will expire after 3 days.</p>
    </div>
    <div class="double-reward-list">
        <div class="double-reward-list_item"
        v-for="user in userList"
        :key="user.userId"
        >
            <div class="item_pic"><img :src="user.userPic" alt=""></div>
            <div class="item_name ellipsis-1" :class="{'highlight': user.isMe === 1 }">{{user.userName}}</div>
        </div>
        <div class="more-button" @click="getMore" v-if="!isEnding">Get More</div>
    </div>
  </div>
</template>

<script>
import { doubelRewardList } from '../assets/js/api.js'
import BackArrow from '../components/BackArrow'
import utils from '../assets/js/utils.js'

export default {
  name: 'DoubleRewardCard',
  data () {
    return {
      userList: [],
      offset: 0,
      limit: 10,
      isLoading: false,
      isEnding: false
    }
  },
  components: {
    BackArrow
  },
  methods: {
    getMore () {
      if (this.isLoading) return
      this.isLoading = true
      doubelRewardList(this.offset, this.limit).then(({ data }) => {
        console.log(data)
        if (data.result === 1 && data.code === 0) {
          let userList = data.data.map(item => {
            let obj = {}
            obj.userName = item.un
            obj.userPic = item.up
            obj.userId = item.ud
            obj.isMe = item.sf
            return obj
          })
          if (userList.length > 0) {
            this.userList.push(...userList)
            this.offset += this.limit
          } else {
            this.isEnding = true
          }
          this.isLoading = false
        }
      })
    }
  },
  mounted () {
    utils.statistic('double_bonus_page', 0)
    this.getMore()
  }
}
</script>

<style lang="less" scoped>
.double-reward {
  position: relative;
  &-rule {
    width: 660px;
    height: 470px;
    border-radius: 10px;
    overflow: hidden;
    padding: 0 20px 20px;
    background-image: url("../assets/images/double-rule-bg.jpg");
    background-size: cover;
    color: #fff;

    h2 {
      text-align: center;
      font-size: 32px;
      margin: 34px 0 28px;
      font-family: "Roboto", Arial, serif;
      font-weight: bold;
    }

    p {
      font: normal 28px/1.8 "Roboto", Arial, serif;
    }
  }
  &-card {
    width: auto;
    height: 1681px;
    background-image: url("../assets/images/double-reward-bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    padding: 590px 30px 0;
  }
  &-card__back {
    position: absolute;
    top: 25px;
    left: 30px;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    width: 660px;
    height: 500px;
    background-color: rgba(255, 255, 255, 0.16);
    border-radius: 10px;
    padding: 10px 30px 0;
    overflow-y: scroll;
    margin-top: 110px;
    .more-button {
      color: #fff;
      width: 100%;
      text-align: center;
      font: 200 24px "Roboto", Arial, serif;
      height: 40px;
      line-height: 40px;
    }
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
      font: normal 24px/100px "Roboto", Arial, serif;
      color: #fff;
      max-width: 130px;
      float: left;
    }

    .highlight {
      color: orange;
    }
  }
}
</style>
