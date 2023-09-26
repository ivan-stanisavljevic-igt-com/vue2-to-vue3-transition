<template>
  <div class="meta-content-component" >

  </div>
</template>

<script>
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'meta-content',

    mixins: [
      BettingOffer,
      Branding
    ],

    components: {},

    props: [
      'metaContentNodes'
    ],

    metaInfo () {
      return {
        title: this.metaTitle, // set a title
        base: {target: '_blank', href: '/'},
        htmlAttrs: {
          lang: 'en'
        },
        link: [
          { rel: 'canonical', href: this.fullPath },
          { rel: 'alternate', href: this.fullPath, hreflang: 'x-default' },
          { rel: 'alternate', href: this.fullPath, hreflang: 'en' }
        ],
        meta: [
          { charset: 'utf-8' },
          { name: 'description', content: this.metaDescription },
          { name: 'keywords', content: this.metaKeywords }
        ]
      }
    },

    computed: {
      fullPath () {
        let path = document.location.protocol + '//' + document.location.host + this.$route.fullPath
        return path
      },
      rootMetaNavigation () {
        if (this.metaContentNodes && this.metaContentNodes.bonavigationnodes) {
          return this.metaContentNodes.bonavigationnodes.find(res => res.idfwbonavigationtypes[0] === 'TABCONTAINER') || undefined
        }
      },
      metaTitle () {
        if (this.$route.name === 'sports-live') {
          return this.$t('Page.Meta.Title')
        } else if (this.$route.name === 'sports') {
          return (this.rootMetaNavigation && this.rootMetaNavigation.metatagtitle) || this.$t('Page.Meta.Title')
        } else {
          return (this.currentMetaNavigation && this.currentMetaNavigation.metatagtitle) || (this.rootMetaNavigation && this.rootMetaNavigation.metatagtitle) || this.$t('Page.Meta.Title')
        }
      },
      metaDescription () {
        if (this.$route.name === 'sports-live') {
          return this.$t('Page.Meta.Description')
        } else if (this.$route.name === 'sports') {
          return (this.rootMetaNavigation && this.rootMetaNavigation.metatagdescr) || this.$t('Page.Meta.Description')
        } else {
          return (this.currentMetaNavigation && this.currentMetaNavigation.metatagdescr) || (this.rootMetaNavigation && this.rootMetaNavigation.metatagdescr) || this.$t('Page.Meta.Description')
        }
      },
      metaKeywords () {
        if (this.$route.name === 'sports-live') {
          return this.$t('Page.Meta.Keywords')
        } else if (this.$route.name === 'sports') {
          return (this.rootMetaNavigation && this.rootMetaNavigation.metatagkeywords) || this.$t('Page.Meta.Keywords')
        } else {
          return (this.currentMetaNavigation && this.currentMetaNavigation.metatagkeywords) || (this.rootMetaNavigation && this.rootMetaNavigation.metatagkeywords) || this.$t('Page.Meta.Keywords')
        }
      },
      currentMetaNavigation () {
        if (this.bonavigation2 && this.bonavigation2.metatagdescr) {
          return this.bonavigation2 || undefined
        } else {
          return this.bonavigation1 || undefined
        }
      },
      bonavigation1 () {
        return (this.idfwbonavigation1 && this.boNavigation && this.boNavigation[this.idfwbonavigation1]) || undefined
      },
      bonavigation2 () {
        return (this.idfwbonavigation2 && this.boNavigation && this.boNavigation[this.idfwbonavigation2]) || undefined
      }
    }
}
</script>

<style lang="stylus" scoped>
</style>
