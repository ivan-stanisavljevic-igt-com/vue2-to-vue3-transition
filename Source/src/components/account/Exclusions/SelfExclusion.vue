<template>
  <div class="se-cont">
    <div class="loading" v-if="processing">
      <dots-loader></dots-loader>
    </div>
    <div class="se-wrapper self-exclusion-v2" v-if="fetchCompleted">
      <div class="initial-screen">
        <div class="se-chld-header">
          <span>{{$t('Account.Exclusions.SE.Header')}}</span>
        </div>
        <div class="se-chld-info">
          <div>{{$t('Account.Exclusions.SE.InitScreen.Desc.One')}}</div>
          <div>{{$t('Account.Exclusions.SE.InitScreen.Desc.Two')}}</div>
        </div>
        <div class="se-chld-ctacont" :class="{'dge': isNJ}">
          <div v-if="isNJ" @click.stop="openDGEUrl" class="se-dge"><div>{{$t('Account.Exclusions.SE.DGE')}}</div></div>
          <div class="se-chld-btns">
            <v-btn color="success" @click="apply()">{{$t('Account.Exclusions.Apply')}}</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/router'
import store from '@/store'
import dotsLoader from '@/components/common/DotsLoader'
export default {
  mixins: [ ],
  components: {
    dotsLoader
  },
  data: () => ({
  }),
  computed: {
    fetchCompleted: () => store.getters['exclusions/fetchCompleted'],
    fetchFailed: () => store.getters['exclusions/fetchFailed'],
    processing () {
      return !(this.fetchCompleted || this.fetchFailed)
    },
    dgeUrl () {
      return store.getters['exclusions/dgeUrl']
    },
    isNJ: () => window.ctsautoconf.STATE === 'NJ'
  },
  methods: {
    apply () {
      router.push({name: 'se-confirmation'})
    },
    openDGEUrl () {
      window.open(this.dgeUrl)
    }
  },
  mounted () {
    store.dispatch('exclusions/fetchSelfExclusionText')
  },
  destroyed () {
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .se-cont
    @media mobile-big-and-below
      padding 0 10px
  .se-wrapper
    border 1px solid #dbdce0
    .se-chld-header
      background #0b4da1
      color #fff
      text-align left
      span
        display block
        padding 11px
        font-size 16px
        font-weight bold
    .se-chld-info
      text-align justify
      font-size 12px
      display block
      padding 5px
      line-height 15px
    .se-chld-ctacont
      display flex
      justify-content center
      margin 0 10px
      &.dge
         justify-content space-between
      .se-dge
        display flex
        align-items center
        cursor pointer
        text-decoration underline
      .sr-chld-btns
        margin 10px
    .step-one-header
      padding 5px
      h2
        text-align left
    .step-one-info
      padding 5px
      text-align left
    .control-block
      display flex
      align-items center
      margin-bottom 0
      height 45px
      padding 0
      .input
        width auto
        order 1
        flex 1 0 auto
        padding 10px 5px
      
</style>
