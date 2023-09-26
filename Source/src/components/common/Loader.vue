<template>
  <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>

<script>
export default {
  name: 'Loader'

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .spinner {
    margin: 20px 0;
    width: 2.5rem;
    text-align: center;
  }

  .spinner > div {
    width: 0.6rem;
    height: 0.6rem;
    background-color: #333;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation-delay: 0.48s;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: 0.16s;
    animation-delay: 0.16s;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: 0.32s;
    animation-delay: 0.32s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
</style>
