<template>
  <p class="dots-loader"><span>.</span><span>.</span><span>.</span></p>
</template>
<script>
export default {
  name: 'dots-loader'

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dots-loader {
  background-color: #FFF;
  height: 72px;
  display: block;
  position: relative;
  width: 100%;
  padding: 0px;
  box-shadow: 0px -1px 0px #CFD6DB;
}
span {
  color:#0b4da1;
  font-size: 50px;
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  position: relative;
  bottom: 15px;
}

span:nth-child(2) {
  animation-delay: .2s;
}

span:nth-child(3) {
  animation-delay: .4s;
}

@keyframes blink {
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: .2;
  }
}
</style>