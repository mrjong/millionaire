<template>
  <div class="rule">
    <p class="header" @click="goBack">
      <span class="iconfont icon-fanhui"></span>
    </p>
    <div class="rule-container">
      <div class="rule__wrap">
        <p class="title">{{$t('rule.title')}}</p>
        <div class="rule-item" v-for="(col, idx) in $t('rule.ruleList')" :key="idx">
          <div class="rule-item__wrap">
            <img :src="ruleList[idx].img" class="rule-item__wrap__img">
          </div>
          <div class="rule-item__title">
            <span class="rule-item__title__index">{{idx + 1}}</span>
            {{col.title}}
          </div>
          <p class="rule-item__text">
            {{col.describe}}
          </p>
        </div>
        <div class="share" @click="toFb">
          <a class="share__fb" ref="toFbBrowser">
            <p class="share__wrap">
              <img src="../assets/images/facebook.png" alt="" class="share__wrap__icon">
            </p>
            <p class="share__describe">{{$t('rule.fb_describe')}}</p>
          </a>
        </div>
      </div>
      <policy-link color="#241262"></policy-link>
    </div>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
import PolicyLink from '../components/PolicyLink'
export default {
  name: 'Rule',
  data () {
    return {
      ruleList: [
        {
          img: `./static/images/rule1.png`
        },
        {
          img: `./static/images/rule2.png`
        },
        {
          img: `./static/images/rule3.png`
        },
        {
          img: `./static/images/rule4.png`
        },
        {
          img: `./static/images/rule5.png`
        },
        {
          img: `./static/images/rule6.png`
        },
        {
          img: `./static/images/rule7.png`
        }
      ]
    }
  },
  methods: {
    toFb () {
      utils.toFbBrowser()
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  components: {
    PolicyLink
  }
}
</script>
<style scoped lang="less" type="text/less">
.rule {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .rule-container {
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    flex: 1;
  }
  &__wrap {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
  }
}
.header {
  width: 54px;
  height: 54px;
  background: #241262;
  border-radius: 50%;
  margin: 24px 0 38px 25px;
  align-self: flex-start;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  span {
    font-size: 28px;
    transform: translate(-2px, 0px);
  }
}
.title {
  width: 281px;
  height: 56px;
  background: url('../assets/images/rule-title-bg.png') no-repeat left top;
  background-size: contain;
  color: #241262;
  font: 700 36px/56px 'Roboto', Arial, serif;
  text-align: center;
}
.rule-item {
  width: 100%;
  padding: 0 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  &__wrap {
    width: 277px;
    &__img {
      width: 100%;
    }
  }
  &__title {
    font: 500 28px 'Roboto', Arial, serif;
    margin: 44px 0 28px 0;
    color: #241262;
    &__index {
      display: inline-block;
      width: 35px;
      height: 35px;
      font: 300 21px 'Roboto', Arial, serif;
      background: url('../assets/images/index-bg.png') no-repeat top left;
      background-size: contain;
      text-align: center;
      line-height: 35px;
      margin-right: 13px;
      color: #241262;
    }
  }
  &__text {
    font: 300 28px/32px 'Roboto', Arial, serif;
    color: #241262;
    text-align: center;
  }
}
.share {
  width: 100%;
  padding: 0 156px;
  margin-top: 100px;
  &__fb {
    display: block;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__wrap {
    width: 135px;
    &__icon {
      width: 100%;
    }
  }
  &__describe {
    color: #241262;
    font: 500 30px/35px 'Roboto', Arial, serif;
    margin: 28px 0 140px;
    text-align: center;
  }
}
.bottom-text {
  color: #241262 !important;
}
.terms {
  font: 500 30px/35px 'Roboto', Arial, serif;
  margin-bottom: 20px;
}

.terms::active {
  color: #241262;
}

.terms::visited {
  color: #241262;
}
</style>
