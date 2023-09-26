<template>
  <a href="#" ref="linkElement" @click="onClick">
    <slot></slot>
  </a>
</template>

<script>
import mobileBridge from '@/library/mobileBridge'
import Screen from '@/components/mixins/Screen'
export default {
  mixins: [
    Screen
  ],
  props: {
    getAuthLink: { type: Function, required: true }
  },

  data () {
    return {
      isInside: false
    }
  },

  computed: {
    isProcessing () {
      return this.isInside
    }
  },

  methods: {
    onClick (event) {
      if (this.isInside) {
        // event.preventDefault()
        return
      }
      this.isInside = true

      this.getAuthLink()
        .then(link => {
          this.$refs.linkElement.href = link
          if (window.ctsautoconf.MOBILE_LS) {
            mobileBridge.bridgeSendRequest('mobileDownloadPdf', link)
          } else {
            this.$refs.linkElement.click()
          }
          this.$nextTick(() => {
            this.$refs.linkElement.href = '#'
          })
        }).catch(err => {
          console.error('auth link error', err)
        }).finally(() => {
          this.isInside = false
        })
    }
  }
}
</script>

<style>

</style>
