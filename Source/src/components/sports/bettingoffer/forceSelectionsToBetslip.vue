<template>

</template>
<script>
  import store from '@/store'
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'big3MarketsHeader',

    components: {
    },

    mixins: [
      BettingOffer
    ],

    props: [
    ],

    computed: {
      idfoselectionscsv () {
        return this.$route.params.idfoselectionscsv
      },
      arridfoselections () {
        if (this.idfoselectionscsv) {
          var idfoselections = this.idfoselectionscsv.split('-')
          if (idfoselections.length > 0) {
            for (let i = 0; i < idfoselections.length; i++) {
              if (idfoselections[i].indexOf('.') === -1) {
                idfoselections[i] = idfoselections[i] + '.1'
              }
            }

            return idfoselections
          }
        }
        return []
      }
    },

    methods: {
      addSelectionsToBetslip () {
        if (this.arridfoselections && this.arridfoselections.length > 0) {
          store.dispatch('sbBetslipState/injectselections', this.arridfoselections)
        }
        this.$router.push({name: 'sports', params: {}})
      }
    },

    mounted () {
      var self = this
      setTimeout(function () {
        self.addSelectionsToBetslip()
      }, 100)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
</style>
