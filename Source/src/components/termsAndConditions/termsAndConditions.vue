<template>
  <div>
    <iframe ref="ifrTandC" frameborder="0" :style="{'height' : iframeHeight}" @load="iframeLoaded"></iframe>
  </div>
</template>

<script>
  import lib from '@/library'
  import config from '@/config'
  export default {
    name: 'termsAndConditions',
    data: () => ({
      iframeHeight: '400px'
    }),
    methods: {
      getTermsAndConditionContent () {
        lib.rpcService.callBroker('UserService', 'GetTsAndCsText', {'IDMDLanguage': config.app.language, 'versionNumber': null})
          .then(response => {
            let res = response && response.result
            let ifrTandC = this.$refs.ifrTandC
            ifrTandC = ifrTandC && (ifrTandC.contentWindow || ifrTandC.contentDocument.document || ifrTandC.contentDocument)
            if (ifrTandC) {
              ifrTandC.document.open()
              ifrTandC.document.write(res)
              ifrTandC.document.close()
            }
          }).catch(error => {
            console.log(error)
          })
      },
      iframeLoaded () {
        setTimeout(() => {
          let ifrTandC = this.$refs.ifrTandC
          ifrTandC = ifrTandC && (ifrTandC.contentWindow || (ifrTandC.contentDocument.document || ifrTandC.contentDocument))
          this.iframeHeight = (ifrTandC.document.body.scrollHeight + 40) + 'px'
        }, 1)
      }
    },
    mounted () {
      this.getTermsAndConditionContent()
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"

  iframe
    width 100%
    height 100%
</style>
