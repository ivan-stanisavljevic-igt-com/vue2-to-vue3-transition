<template>
  <div class="page-content">
    <!--sports-breadcrumb></sports-breadcrumb-->
    [Account Page]
    <account-register-component></account-register-component>
  </div>
</template>
<script>
  import BoNavigation from '@/components/sports/bettingoffer/BoNavigation'
  import BoNodeContent from '@/components/sports/bettingoffer/BoNodeContent'
  import SportsBreadcrumb from '@/components/sports/bettingoffer/SportsBreadcrumb'
  import Screen from '@/components/mixins/Screen'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import AccountRegisterComponent from '@/components/account/AccountRegisterComponent'

  export default {
    name: 'AccountPage',

    mixins: [
      Screen,
      BettingOffer
    ],

    components: {
      BoNavigation,
      BoNodeContent,
      SportsBreadcrumb,
      AccountRegisterComponent
    },

    data () {
      return {
        right: true
      }
    },

    computed: {
      currentBoNavigation () {
        var idfwbonavigation = this.idfwbonavigation2 || this.idfwbonavigation1 || 'top'
        return (idfwbonavigation && this.boNavigation && this.boNavigation[idfwbonavigation]) || undefined
      }
    },

    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
