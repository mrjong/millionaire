<template>
  <div class="respondence-container">
     <div class="respondence-container__countdown">
      <svg id="circleProcess" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="41%" stroke="#ececef" stroke-width="4"></circle>
        <circle id="circle" cx="50%" cy="50%" r="41%" stroke=" #ffcc03" stroke-width="4.5"></circle>
        <text x="50%" y="-32%" class="text" fill="#241262" stroke-width="4">{{rangeValue}}</text>
      </svg>
    </div>
    <p class="respondence-container__question">
      1.provident quae recusandae similique velit veniam voluptatibus voluptatum? Porro, quod.
    </p>
    <div class="respondence-container__answer">
      <answer></answer>
      <answer></answer>
      <answer></answer>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Answer from '../components/Answer.vue'
export default {
  name: 'Respondence',
  data () {
    return {
      rangeValue: 10
    }
  },
  mounted () {
    this.countDown()
  },
  computed: {
    ...mapGetters({
    })
  },
  methods: {
    ...mapActions({}),
    countDown () {
      let circle = document.getElementById('circle')
      setTimeout(() => {
        circle.style.strokeDashoffset = 0
      }, 100)
      let timer = setInterval(() => {
        this.rangeValue -= 1
        if (this.rangeValue === 0) {
          clearTimeout(timer)
        }
      }, 1000)
    }
  },
  components: {
    Answer
  }
}
</script>
<style scoped lang="less" type="text/less">
  .respondence-container{
    box-sizing: border-box;
    margin: 25px;
    background-color: #fff;
    border-radius: 28px;
    padding: 50px 23px;
    &__countdown{
      width: 113px;
      height: 113px;
      margin:0 auto;
    }
    &__question{
      font-size: 28px;
      color: #241262;
      margin: 43px auto 50px;

    }
    &__answer{
      /*text-align: center;*/
    }
  }
  #circleProcess {
    position: relative;
    width: 100%;
    height:100%;
    fill: none;
    transform:rotate(-90deg);
    background-color: transparent;
  }
  #circle{
    stroke-dasharray: 314px;
    stroke-dashoffset: 314px;
    transition: stroke-dashoffset 10s linear;
  }
  .text{
    transform:rotate(90deg);
    font-size: 56px;
    color: #241262;
    font-weight: 600;
    text-anchor: middle;
  }
</style>
