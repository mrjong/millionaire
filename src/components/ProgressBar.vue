<template>
  <div class="progress" :style="{width: progressObj.width, height: progressObj.height}">
      <svg id="circleProcess" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="44%" stroke="#acabb0"
                :stroke-width="progressObj.strokeWidth"
                style="stroke-opacity: 0.1">
        </circle>
        <circle id="circle" cx="50%" cy="50%" r="44%"
                :stroke="progressObj.strokeColor"
                :stroke-width="progressObj.strokeWidth"
                ref="circle"
                :style="progressObj.progressStyle">
        </circle>
        <text x="50%" y="55%" class="text" fill="#241262"
              :stroke-width="progressObj.strokeWidth">
          {{progressObj.restTime}}
        </text>
      </svg>
    </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progressObj: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {
    this.$emit('progress', this.$refs.circle)
  },
  methods: {}
}
</script>
<style scoped lang="less" type="text/less">
  .progress{
      width: 113px;
      height: 113px;
      align-self: center;
      margin: 0 auto;
    }
  #circleProcess {
    width: 100%;
    height: 100%;
    fill: none;
    background-color: transparent;
  }
  #circle{
    stroke-dasharray: 314px;
    stroke-dashoffset: 314px;
  }
  .text{
    text-anchor: middle;
    dominant-baseline: middle;
    font: 700 56px 'Roboto Condensed', Arial, serif;
  }
</style>
