<template>
  <div>
    <div class="verTitles" :class="{'padding-b-20': accountSummaryFlow, 'margin-b-0': !isMapPage}">
      <div class="verTextContainer" :class="{accountSummaryFlow, 'flex-grow-center': isStepsExists}">
        <!-- <p class="verAccountTitle">{{ $t('Account.SequentialVerification.Verification.Title') }}</p> -->
        <div class="titles">
          <p class="guidedTitle" v-if="isStepsExists">{{ $t('Account.SequentialVerification.GuidedVerification.Title') }}</p> 
          <p class="title">{{ currStepTitle }}</p>
          <p class="stepTitle" v-if="isStepsExists">{{ $t('Account.SequentialVerification.GuidedVerification.currentStepText', {currentStep: currentStep, maxStep: maxStep}) }}</p>
        </div>
      </div>
      <v-icon v-if="isMapPage" class="close" @click.stop="go2verification()">close</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerTitles',
  props: ['currStepTitle', 'isMapPage', 'currentStep', 'maxStep'],
  computed: {
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    },
    isStepsExists () {
      return this.currentStep && this.maxStep
    }
  },
  methods: {
    go2verification () {
      this.$emit('closePage')
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="stylus">

.verTitles
  display: flex
  justify-content: space-between
  align-items: center
  flex: 1
  margin-bottom: 30px
  .verTextContainer
    .verAccountTitle
      font-family: "Open Sans Bold" !important
      margin-bottom: 3px
      color: #ff9016
      text-transform: uppercase
      font-size: 13px

    .title
      font-size 20px
      line-height 100px
      margin-bottom: 5px
      font-family: "Open Sans Bold" !important
    .guidedTitle
      font-size 17px
      margin-bottom: 5px
      color: #ff9016
      font-family: "Open Sans Bold" 
    .stepTitle
      font-size 16px
      margin: 5px 0
      font-weight 900
      font-family: "Open Sans Bold"
  .flex-grow-center
    flex-grow: 1
    text-align: center
  .close
    position: absolute
    right: 5px
    top: 5px
    font-size: 40px
.padding-b-20
  padding-bottom: 10px
.margin-b-0
  margin-bottom: 0px
</style>
