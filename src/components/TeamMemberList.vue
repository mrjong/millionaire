<template>
    <div class="team-member-list">
        <div class="team-member-list__logo bg-noRepeat bg-cover bg-center" v-webp.bg="`url('myteam_bg.png')`">My Team</div>
        <div class="team-member-list__member">
          <ul style="display: flex; padding-top: 10px">
            <li class="item" v-for="item in memberList" :key="item.userId" :class="{'gray': item.anwserStatus < 0 }">
              <div class="captain bg-cover" v-if="item.captain === 1" v-webp.bg="`url('crown-icon.png?w=26&h=22')`"></div>
              <div class="avatar"><img :src="item.userAvatar" alt=""></div>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: 'TeamMemberList',
  data () {
    return {
      list: [
        // {
        //   userAvatar: require('../assets/images/rule-bg.jpg'),
        //   anwserStatus: -1,
        //   captain: 0
        // },
        // {
        //   userAvatar: require('../assets/images/rule-bg.jpg'),
        //   anwserStatus: 111,
        //   captain: 1
        // },
        // {
        //   userAvatar: require('../assets/images/rule-bg.jpg'),
        //   anwserStatus: -1,
        //   captain: 0
        // },
        // {
        //   userAvatar: require('../assets/images/rule-bg.jpg'),
        //   anwserStatus: 2,
        //   captain: 0
        // },
        // {
        //   userAvatar: require('../assets/images/rule-bg.jpg'),
        //   anwserStatus: -1,
        //   captain: 0
        // }
      ]
    }
  },
  props: {
    memberList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
.team-member-list {
  position: absolute;
  left: 0;
  top: 25px;
  overflow: hidden;
  &__logo {
    width: 130px;
    height: 32px;
    padding-top: 2px;
    padding-left: 5px;
    color: #fff;
    font: italic 22px 'Roboto', Arial, serif;
  }
  &__member {
    padding-left: 10px;
    max-width: 250px;
    overflow: hidden;
    .item {
      position: relative;
      border: 4px solid #fff;
      margin-left: -10px;
      border-radius: 50%;
      &:nth-child(1) {
        z-index: 1;
      }
      &:nth-child(2) {
        z-index: 2;
      }
      &:nth-child(3) {
        z-index: 3;
      }
      &:nth-child(4) {
        z-index: 4;
      }
      &:nth-child(5) {
        z-index: 5;
      }
      img {
        width: 100%;
        height: 100%;
      }
      .captain {
        position: absolute;
        top: -15px;
        right: -2px;
        width: 26px;
        height: 22px;
      }
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
}
</style>
