<template>
  <div class="loader"></div>
</template>

<script>
export default {
  name: 'circle-loader'

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loader {
		border: 7px solid #CFD6DB;
    border-top: 7px solid #0b4da1;
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
