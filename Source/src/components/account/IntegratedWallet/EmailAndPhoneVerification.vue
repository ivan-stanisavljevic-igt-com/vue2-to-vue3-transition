<template>
  <div class="page-content account" :class="{'account--verify-route' : routeNameIsVerify}">
    <div class="mail verify ctsform" v-if="isVerifyEmail">
      <div class="mail-verify">
        <h2>{{ $t('Account.JoinUs.VerificationByPin.Email') }}</h2>
        <div class="verify__inner">
          <!-- email is already verified -->
          <div v-if="isEmailVerified">
            {{ $t('Account.VerificationByPin.Email.Verified') }}
          </div>
          <!-- email is not verified -->
          <VerificationByPin :verify="'email'" v-else></VerificationByPin>
        </div>
      </div>
    </div>
    <div class="phone verify ctsform" v-if="isVerifyPhone">
      <div class="phone-verify">
        <h2>{{ $t('Account.JoinUs.VerificationByPin.Phone') }}</h2>
        <div class="verify__inner">
          <!-- phone is already verifed -->
          <div v-if="isPhoneVerified">
            {{ $t('Account.VerificationByPin.Phone.Verified') }}
          </div>
          <!-- phone is not verifed -->
          <VerificationByPin :verify="'phone'" v-else></VerificationByPin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VerificationByPin from '@/components/account/IntegratedWallet/VerificationByPin.vue'
  import store from '@/store'

  export default {
    name: 'EmailAndPhoneVerification',
    components: {
      VerificationByPin
    },
    computed: {
      isVerifyEmail () {
        return (this.$route.params.verify && this.$route.params.verify.toLowerCase()) === 'email'
      },
      isVerifyPhone () {
        return (this.$route.params.verify && this.$route.params.verify.toLowerCase()) === 'phone'
      },
      isEmailVerified () {
        return store.getters['getIsEmailVerified']
      },
      isPhoneVerified () {
        return store.getters['getIsPhoneVerified']
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      routeNameIsVerify () {
        return this.$route.name === 'verify'
      }
    },
    methods: {
      refreshCustomerContext () {
        store.dispatch('getCustomerContext')
      }
    },
    mounted () {
      if (this.isLoggedIn) {
        this.refreshCustomerContext()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .page-content.account
    flex-direction column
    h2
      text-align center
    .verify
      cursor default
      &.mail
        padding-bottom 0
      .mail-verify,
      .phone-verify
        margin 5px
        border 1px solid #1f375b
        padding 10px
        border-radius 5px
    &.account--verify-route
      h2
        text-align left
        font-size 16px
        background #0b4da1
        color #fff
        padding 11px
        margin 0
      .verify
        .mail-verify,
        .phone-verify
          border none
          .verify__inner
            padding 5px
            border 1px solid #dbdce0
  </style>
