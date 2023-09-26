<template>
  <div class="security-settings">
    <div class="component-container">
      <div class="change-pass-component">
        <h2>{{ $t('Account.Settings.Password.Title') }}</h2>
        <ChangePassword></ChangePassword>
      </div>
    </div>
  </div>
</template>
<script>
  import ChangePassword from '@/components/account/IntegratedWallet/IWChangePassword'

  export default {
    mixins: [],
    components: {
      ChangePassword
    },
    data () {
      return {}
    },
    computed: {},
    mounted () {}
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .container
    h1
      font-size 15px
      margin 0px
</style>
