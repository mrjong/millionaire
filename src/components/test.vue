<template>
<div class="outer-wrap">
  <div class="wrap">
       <div class="mark">
          <!-- <div class="msg-wrap"> -->
              <!-- <div class="msg-scroll">
                  <p>1</p>
                  <p>2</p>
                  <p>3</p>
              </div> -->
          <!-- </div> -->
       </div>
  </div>
</div>
</template>

<script>
// import * as type from '../store/type'
export default {
  name: 'Compere',
  data () {
    return {
      supaTimer: null
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped lang="less" type="text/less">
.outer-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.wrap {
    width: 100%;
    height: 100%;
    flex:1;
    position: relative;
    // overflow: hidden;
    overflow: auto;
    margin-bottom: 35px;
    border: 5px solid gold;
    box-sizing: border-box;
}
.mark {
    width: 100%;
    height: 100%;
    border: 5px solid red;
    box-sizing: border-box;
}
.msg-wrap {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    border: 5px solid palevioletred;
}
.msg-scroll {
    width: 100%;
    height: auto;
    color: #fff;
}
</style>
