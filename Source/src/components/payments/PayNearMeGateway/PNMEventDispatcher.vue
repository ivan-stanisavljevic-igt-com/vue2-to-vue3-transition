<template/>
<script>
export default {
  props: ['paymentIsCompleted'],
  methods: {
    isRedirectedFromPayNearMe () {
      let returnUrl = window.location.search
      if (returnUrl.includes('amp%3B')) returnUrl = returnUrl.replaceAll('amp%3B', '')
      return new URLSearchParams(returnUrl).get('pnm_order_identifier')
    },
    closeIFrame () {
      if (this.isRedirectedFromPayNearMe()) {
        console.log(`[PNM] Redirected from PNM to: ${window.location.href}`)
        window.top.postMessage({
          data: 'closePNMIFrame',
          URIqueryString: window.location.search
        }, '*')
        if (this.paymentIsCompleted) {
          window.top.postMessage('navigate2PaymentCompletedPage', '*')
        }
      }
    }
  },
  mounted () {
    this.closeIFrame()
  }
}
</script>