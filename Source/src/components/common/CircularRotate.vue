<template>
  <div>
    <v-progress-circular v-if="!mobileBigAndBelow"
      :size="40"
      :width="2"
      :rotate="-90"
      :value="value"
      color="white"
    >
    </v-progress-circular>
    <v-progress-circular v-if="mobileBigAndBelow"
      :size="20"
      :width="2"
      :rotate="-90"
      :value="value"
      color="white"
    >
    </v-progress-circular>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        interval: {},
        value: 100
      }
    },
    props: [
      'rotationInterval',
      'mobileBigAndBelow'
    ],
    computed: {
      calculateValueBasedOnInterval () {
        return 100 / ((this.rotationInterval - 1000) / 1000)
      }
    },
    methods: {
      startRotation () {
        this.interval = setInterval(() => {
          if (this.value === 0) {
            return (this.value = 100)
          }
          this.value -= this.calculateValueBasedOnInterval
        }, 1000)
      }
    },
    mounted () {
      this.startRotation()
    },
    beforeDestroy () {
      clearInterval(this.interval)
    }
  }
</script>

<style lang="stylus" scoped>
.container 
  .headlines
    .headline
      .arrows-container
        .progress-circular
          margin: 1rem
          animation fade 1s
          -webkit-animation fade 1s

  @keyframes fade
      0% {opacity: 0;}
      100% {opacity: 1;}
  
</style>