<template>
  <div class="app-installer">
    <div class="sports-page">
    <v-layout  class="page-layout">
      <v-flex class="main-column" :style="{paddingTop: headerHeight + 'px'}" ref="maincolumn">
        <resize-observer @notify="mainColumnResize" />
         <div class="staticcontent">
          <div class="static-content accpage">
            <static-content v-if="routeName === 'app'" :staticcontentpath="'/static/appinstaller/app.html'" :fullPath="true" :method="'html'"></static-content> 
            <static-content v-if="routeName === 'android'" :staticcontentpath="'/static/appinstaller/android.html'" :fullPath="true" :method="'html'"></static-content> 
          </div>
         </div>
      </v-flex>
    </v-layout>
  </div>
  </div>
</template>

<script>
import store from '@/store'
import StaticContent from '@/components/common/StaticContent'

export default {
  name: 'AppInstaller',

  components: {
    StaticContent
  },

  data () {
    return {
    }
  },

  methods: {
    mainColumnResize () {
      var mainColumn = this.$refs.maincolumn
      if (mainColumn) {
        store.commit('screenState/setMainColumnWidth', mainColumn.offsetWidth)
      }
    }
  },
  computed: {
    headerHeight () {
      return store.getters['screenState/getHeaderHeight']
    },
    mainColumnWidth () {
      return store.getters['screenState/getMainColumnWidth']
    },
    routeName () {
      return this.$route.name
    }
  },
  mounted () {
    this.mainColumnResize()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  created () {
    window.scrollTo(0, 0)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/css/config'

iframe
  width 100%
  height 100%
  // min-height 400px
.static-content
  .ca
    padding 5px 0
    .pd-icon
      width 30px
      display inline-flex
      align-items center
      justify-content center
  .ca_email .pd-icon
    font-size 15px
.staticcontent
  display flex
  align-items center
  justify-content center

</style>
