<template>
  <div class="teaser-group">

    <selection-teaser v-for="selection in selections"
                  :key="selection.IDFOSelection"
                  :id="selection.IDFOSelection"
                  :currentBetSlipState="currentBetSlipState"
                  :tab="tab"
                  :allowedBetTypesAndReturns="{}"
                  :activeTeaser="activeTeaser"
                  :interRelatedTeaser="interRelated[selection.IDFOSelection]"
                  :mixedTeasers="mixedTeasers"
    ></selection-teaser>



    <!--<br><b>groupId:</b> {{groupId}}-->
    <!--<br><b>selectionsLen:</b> {{selectionsLen}}-->
    <!--<br><b>activeTeaser:</b> {{activeTeaser}}-->
    <!--<br><b>abtnr:</b> {{abtnr}}-->
    <!--<br><b>betslipSelectionIds:</b> {{betslipSelectionIds}}-->
    <!--<br><b>allowedBetTypesAndReturns:</b> {{allowedBetTypesAndReturns.PotentialReturns.PerBetType.A}}-->
  </div>
</template>

<script>
  //  import Vue from 'vue'
//  import store from '@/store'
  import selectionTeaser from '../selections/selectionTeaser.vue'

  export default {
    name: 'TeaserTab',

    mixins: [
    ],

    props: ['tab', 'selections', 'currentBetSlipState', 'allowedBetTypesAndReturns', 'betTypeStakes', 'groupId', 'group', 'activeTeaser', 'mixedTeasers', 'interRelated'],

    components: {
      selectionTeaser
    },

    data () {
      return {
      }
    },

    computed: {
    },

    methods: {
    },

    created () {
    },

    mounted () {
    },

    watch: {
    },

    destroyed () {
//      console.log('Destroyed teaser group ' + this.groupId)
    }
  }
</script>

<style lang="stylus" scoped>

</style>
