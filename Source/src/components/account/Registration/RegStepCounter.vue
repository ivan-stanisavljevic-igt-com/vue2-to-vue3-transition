<template>
  <div class="stepCount">
    <div class="titles">
      <p class="step-number">{{$t('Account.CreateAccount.Registration')}}</p>
      <p class="title">{{ currStepTitle }}</p>
    </div>
    <div class="steps" v-if="currentStep !== 5">
      <v-btn small v-for="(step,i) in steps" :key="step.stepNo" :class="[currentStep > step.stepNo || (currentStep < step.stepNo && !steps[i].isDisabled) ? 'btnStepVisited' : 'btnStep']" :id="'stepNo'+step.stepNo" :disabled="steps[i].isDisabled" @click="jump2Step(step.stepNo)">{{step.stepNo}}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegStepCounter',
  data () {
    return {
      steps: [{stepNo: 1, isDisabled: false, isSelected: true},
              {stepNo: 2, isDisabled: true, isSelected: false},
              {stepNo: 3, isDisabled: true, isSelected: false},
              {stepNo: 4, isDisabled: true, isSelected: false}],
      lastStepReached: false
    }
  },
  methods: {
    stepCounterState (stepNo) {
      if (!this.lastStepReached) {
        switch (stepNo) {
          case 1:
            this.steps[0].isDisabled = false
            this.steps[1].isDisabled = true
            this.steps[2].isDisabled = true
            this.steps[3].isDisabled = true
            break
          case 2:
            this.steps[0].isDisabled = false
            this.steps[1].isDisabled = false
            this.steps[2].isDisabled = true
            this.steps[3].isDisabled = true
            break
          case 3:
            this.steps[0].isDisabled = false
            this.steps[1].isDisabled = false
            this.steps[2].isDisabled = false
            this.steps[3].isDisabled = true
            break
          case 4:
            this.steps[0].isDisabled = false
            this.steps[1].isDisabled = false
            this.steps[2].isDisabled = false
            this.steps[3].isDisabled = false
            this.lastStepReached = true
            break
        }
      }
    },
    jump2Step (stepNo) {
      this.$emit('jump2Step', stepNo)
    }

  },
  props: ['currentStep', 'currStepTitle'],
  mounted () {
  }
}
</script>

<style lang="stylus" scoped>
.stepCount
  display: flex
  flex-direction: column
  justify-content: space-between
  // margin-bottom: 20px
  .steps
    margin-bottom: 10px
    display: flex
    justify-content: center
    align-items: center
    .btnStep
      font-family 'Open Sans ExtraBold'
      box-sizing content-box
      margin-right: 10px
      margin-left: 0px
      height: 28px
      border-radius: 50% !important
      display: inline-block
      // background: #003764 !important **
      border: 1px solid transparent
      color: #fff
      min-width: unset 
      width: 28px
      padding: 0px
      flex-grow: 0
      font-size: 13px
      letter-spacing: 0
      // max-width: 88px <-- Uncomment if step buttons need to be smaller on desktop
    .btnStepVisited
      font-family 'Open Sans ExtraBold'
      box-sizing content-box
      margin-right: 10px
      margin-left: 0px
      height: 28px
      border-radius: 50% !important
      display: inline-block
      background: transparent !important
      // border: 1px solid #003764 **
      // color: #003764 **
      min-width: unset 
      width: 28px
      padding: 0px
      flex-grow: 0
      font-size: 13px
      letter-spacing: 0
      // max-width: 88px <-- Uncomment if step buttons need to be smaller on desktop
    .btnStep.v-btn--disabled
      background: #e5e5e5 !important
      color: white !important
      font-family: "Open Sans Bold" !important
  .titles
    margin-bottom: 12px
    text-align: center
  

.stepCount
  .title
    font-size: 20px
    font-weight: bold
    // margin-top: 15px !important

.stepCount
  .subtitle
    font-size: 15px

.stepCount
  .step-number
    font-family: "Open Sans Bold" !important
    color: #ff9016
    // text-transform: uppercase
    font-size: 17px
    margin-bottom: 2px
    margin-top: 15px

</style>
