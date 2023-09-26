<template>
  <div class="container">
    <span class="counter" v-show="n">{{n}}</span>
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: 'circle-loader-with-counter',
  props: ['n']

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    position: relative;
    text-align: center;
  }

  .counter {
    color: #2396FC;
    font-weight: bold;
    font-size: 14px;
    position: absolute;
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    bottom: 0px;
    margin-left: -15px;
  }

  .browser-internet-explorer .counter{
    left: 50%;
  }

  .loader {
		border: 6px solid #CFD6DB;
    border-top: 6px solid #2396FC;
    border-bottom: 6px solid #2396FC;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
    margin: 10px auto 0 auto;
	}

	@keyframes spin {
    	0% { transform: rotate(0deg) }
    	100% { transform: rotate(360deg) }
	}
</style>
