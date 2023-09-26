<template>
  <div class="observer" />
</template>

<script>
  export default {
    props: ['options'],
    data: () => ({
      observer: null
    }),
    mounted () {
      const options = this.options || {}
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(([entry]) => {
          if (entry && entry.isIntersecting) {
            this.$emit('intersect')
          } else if (entry && !entry.isIntersecting) {
            this.$emit('deintersect')
          }
        }, options)
      }

      this.observer.observe(this.$el)
    },
    destroyed () {
      this.observer.disconnect()
    }
  }
</script>
