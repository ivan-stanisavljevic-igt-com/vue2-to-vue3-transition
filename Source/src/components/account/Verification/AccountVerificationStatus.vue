<template>
  <div class="verification-status-wrapper">
    <div class="acc-verification-status">
      <div v-if="isVerified" class="ver-status color-blue">
        <p>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Detail.Status.Verified') }}</p>
        <span class="icon-verified"></span>
      </div>
      <div v-else class="ver-status color-red">
        <p>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Detail.Status.NonVerified') }}</p>
        <span class="icon-not-verified"></span>
      </div>
      <div v-if="!isVerified">
        <span class="edit-here color-red" @click="forwardToVerify">{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Verify') }} <v-icon class="color-red">chevron_right</v-icon></span>
      </div>
    </div>
    <div class="acc-verification-info">
      <div v-if="detail === 'phone'">
        <span v-if="isVerified" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Phone.Verified')"></span>
        <span v-else v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Phone.NotVerified')"></span>
      </div>
      <div v-else-if="detail === 'email'">
        <span v-if="isVerified" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Email.Verified')"></span>
        <span v-else v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Email.NotVerified')"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountVerificationStatus',
  props: ['isVerified', 'isCustomerVerified', 'detail'],
  methods: {
    forwardToVerify () {
      this.$router.push({ name: 'verification' })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~@/css/config"
@import "~@/css/mixins"

.verification-status-wrapper
  width: 100%
  .acc-verification-status
    display: flex
    align-items: center
    flex: 1 1 auto
    width: 100%
    padding  0px 0px 5px
    .edit-here
      display: flex
      cursor: pointer
      text-align: right
      font-weight: 600
      padding: 0px 5px

    .ver-status
      display: flex
      align-items: center
      font-weight: 600
      font-size 12px
      position static
      width: 29%
      p
        margin: 0px 5px 0px 0px
  .acc-verification-info
    span
      display inline-block
      background #e5e5e5
      border-radius 5px
      padding 10px
      font-size 12px
      text-align left
      margin 5px 0 0 0
      width 100%

.color-red
  color: #ff0000 !important
.color-red p
  color: #ff0000 !important
.color-blue
  color: #1d9add !important
.color-blue p
  color: #1d9add !important

.icon-verified
  display: inline-block
  background-image: url(icons-path'/'verified'.svg')
  height: 23px !important
  width: 20px !important
.icon-not-verified
  display: inline-block
  background-image: url(icons-path'/'not_verified'.svg')
  height: 23px !important
  width: 20px !important
</style>
