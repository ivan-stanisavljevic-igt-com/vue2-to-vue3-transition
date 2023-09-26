<template/>
<script>
export default {
  props: ['paymentIsCompleted'],
  methods: {
    isNuveiOpenedFromIFrame () {
      return window.top !== window.self
    },
    closeIFrame () {
      if (this.isNuveiOpenedFromIFrame()) {
        console.log(`[Nuvei] Redirected from Nuvei to: ${window.location.href}`)
        let isFromNuvei = window.location.href.includes('nuvei')
        if (this.paymentIsCompleted && isFromNuvei) {
          window.top.postMessage({
            messageID: 'navigate2NuveiPaymentCompletedPage',
            payload: window.location.search
          }, '*')
          return
        }
        // false means failed, undefined means nothing
        if (this.paymentIsCompleted === false && isFromNuvei) {
          window.top.postMessage({
            messageID: 'navigate2NuveiPaymentFailedPage',
            payload: window.location.search
          }, '*')
          return
        }
        window.top.postMessage({
          data: 'closeNuveiIFrame',
          URIqueryString: window.location.search
        }, '*')
      }
    }
  },
  mounted () {
    this.closeIFrame()
  }
}
</script>