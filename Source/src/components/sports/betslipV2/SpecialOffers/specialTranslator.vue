<template>
  <span :key="msgid" v-html="translation"></span>
</template>

<script>
//  import Vue from 'vue'
  import store from '@/store'

  export default {
    name: 'specialTranslator',

    props: ['phrId', 'offer'],

    components: {},

    data () {
      return {

      }
    },

    computed: {
      specialOffersBc () {
        return store.getters['sbBetslipState/specialOffersBc']
      },
      configTranslations () {
        return this.specialOffersBc && this.specialOffersBc.translations
      },
      msgid () {
        let offer = this.offer || {}
        let msgid = 'SpecialOffer.' + offer.Id + '.' + this.phrId
        return msgid
      },
      translation () {
        let offer = this.offer || {}
        //
        let toInterpolate = {
          Name: offer.Name,
          Description: offer.Description,
          shortDescription: offer.shortDescription,
          Amount: offer.Amount,
          isCapped: offer.isCapped,
          insuredLegs: offer.insuredLegs,
          legsToAdd: offer.legsToAdd
        }
        //
        let msgid = this.msgid
        let t = msgid in this.configTranslations ? this.configTranslations[msgid] : this.$t(msgid)
        // console.log('translation for:', msgid, ':', t)
        if (t === msgid) {
          return ''
        }
        // t = this.$t(t, toInterpolate)
        for (let i in toInterpolate) {
          t = t.replace('%{' + i + '}', toInterpolate[i])
        }
        return t
      }
    },

    methods: {
    },

    created () {

    },

    watch: {
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
</style>
