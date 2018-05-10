<template>
  <section class="country-list" v-if="value">
    <div class="country-item" v-for="(item, index) in phoneNationCodeList" :key="index" @click="selectCountryCode(item)">
      <span class="country-name">{{item[2] || ''}}</span>
      <span class="country-code">+{{item[1] || ''}}</span>
    </div>
  </section>
</template>
<script>
import {mapGetters} from 'vuex'
import * as type from '../store/type'
export default {
  name: 'country-list',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['phoneNationCode', 'phoneNationCodeList'])
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectCountryCode (countryItem) {
      const [abbr = 'IN', code = '91', country = 'India'] = countryItem
      this.$store.commit(type._UPDATE, {
        phoneNationCode: {
          code,
          country
        }
      })
      this.$emit('country-change', code, country, abbr)
    }
  }
}
</script>
<style lang="less" scoped>
  .country-list {
    width: 100%;
    max-height: 475px;
    overflow: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, .95);

    .country-item {
      width: 92.6%;
      margin-left: 3.7%;
      font: 400 32px/1.2 "Roboto", Arial, serif;
      color: #260964;
      padding: 28px 0;
      position: relative;
      border-bottom: 1px solid #dedae8;

      .country-code {
        float: right;
      }
    }
  }
</style>
