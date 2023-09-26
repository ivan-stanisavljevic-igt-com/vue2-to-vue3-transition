<template>
  <div class="money-input"
       :class="[className, {focused:focused, focusedOther:focusedOther, hasError: hasError, 'non-empty':!!displayValue}]"
  >
    <label class="label-txt">{{placeholder}}</label>
    <span class="currency">{{ currencySymbol }}</span>
    <input
           :class="[statusToConfirmClass, {invisible: stakeChanged}]"
           type="text" class="no-spinners"
           autocomplete="off"
           ref="moneyValue"
           inputmode="decimal"
           step="0.01"
           v-model="displayValue"
           @focus="setFocus(id)"
           @change="change(id)"
           @blur="killFocus(id)"
           @keyup.13="invokeBlur()"
           :disabled="currentBetSlipState>=1 || stakeChanged"
           :id="inputType + 'BetSlipId' + perType"
    />
    <div v-if="inputType=='wager' && stakeChanged" class="stakeChange"  >
      <span class="stakeNew">&nbsp;{{stakeChange.new}}</span>
      <span class="stakeOld">{{stakeChange.old}} </span>
    </div>

    <span class="error-badge" v-show="hasError && !focusOn" ><v-icon>info</v-icon></span>
    <span class="clear-btn" >
      <button v-show="displayValue && focusOn" @mousedown="clearValue()"><v-icon>close</v-icon></button>
    </span>

    <!--id: {{id}}<br>-->
    <!--focus: {{focus}}<br>-->
    <!--focusOn: {{focusOn}}<br>-->
    <!--displayValue: {{displayValue}}<br>-->
    <!--focused: {{focused}}<br>-->
    <!--hasError: {{hasError}}<br>-->
    <!--displayValue: {{displayValue}}-->
    <!--stakeChanged: {{stakeChanged}}<br>-->
    <!--stakeChange: {{stakeChange}}<br>-->
  </div>
</template>

<script>
  //  import Vue from 'vue'
  //  import store from '@/store'
  import config from '@/config'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'moneyInput',

    mixins: [
    ],

    props: ['value', 'id', 'currentBetSlipState', 'tab', 'inputType', 'placeholder', 'focus', 'className', 'stakeChanged',
      'stakeChange', 'perType', 'minStake', 'maxStake', 'statusToConfirm'],

    components: {
      Icon
    },

    data () {
      return {
        cnt: 1,
        focusOn: false,
        toInt: null,
        preventKillFocus: false
      }
    },

    computed: {
      statusToConfirmClass () {
        return this.statusToConfirm ? 'statusToConfirm-' + this.statusToConfirm : ''
      },
      displayValue: {
        get: function () {
          // console.log('get displayValue (' + this.inputType + '): ' + this.value)
//          this.focusOn = !!this.focused
          let val = typeof this.value !== 'undefined' ? this.value : ''
//          console.log('Money get: ' + val)
          if (val) {
            val = Number(val)
            if (val < 0) {
              // val = ''
              val = 0
            }
            val = val.toString() === val.toFixed(2) ||
            val.toString() === val.toFixed(1) ||
            val.toString() === val.toFixed(0) ? val.toString() : val.toFixed(15)
            val = val.toString().replace(/[^\d.]/g, '')
            if (val.indexOf('.00000002') > -1) {
              val = val.split('.00000002')[0]
            } else {
              val = val.split('00000001')[0]
            }
            // return val
            /*
            var arr = val.split('.')
            //
            if (arr[1] && arr[1].length > 2) {
              val = parseFloat(arr[0] + '.' + arr[1] + '00000001')
              val = val.toFixed(2)
              val = parseFloat(val)
            } else {
              val = parseFloat(val)
            }
            */
          }
          // val = val ? parseFloat(val.toFixed(2)) : val
//          console.log('Money get return: ' + val)
//          this.$emit('input', val)
          //
          return val
//          return val
          /*
           if (this.isInputActive) {
           // Cursor is inside the input field. unformat display value for user
           return this.value.toString()
           } else {
           // User is not modifying now. Format display value for user interface
           return "$ " + this.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
           }
           */
        },
        set: function (modifiedValue) {
          // console.log('set displayValue (' + this.inputType + '): ' + modifiedValue)
          // Recalculate value after ignoring "$" and "," in user input
//          let forEmit = ''
          let newValue = modifiedValue.replace(/[^\d.]/g, '')
//          newValue = parseFloat(newValue)
          let hasDot = newValue && newValue.length && newValue.indexOf('.') > -1
          var arr = newValue && newValue.split('.')
          // console.log('hasDot:', hasDot)
          // console.log('arr:', arr)
          //
          newValue = arr[0]
          if (hasDot) {
            newValue += '.'
          }
          if (arr.length >= 2) {
            // newValue = arr[0] + '.' + arr[1]
            arr[1] = arr[1].slice(0, 2)
            newValue += arr[1]
          }
          //
          /*
          if ((arr[1] && arr[1].length > 2) || arr.length > 2) {
            newValue = Math.floor(parseFloat(newValue) * 100) / 100
//            forEmit = newValue
            newValue = newValue.toString() + '0000000' + this.cnt++
            newValue = parseFloat(newValue)
          } else {
            newValue = parseFloat(newValue)
          }
          */
          if (hasDot) {
            newValue = newValue + '00000001' + this.cnt++
          } else {
            newValue = newValue + '.00000002' + this.cnt++
          }
          newValue = parseFloat(newValue)
          // Ensure that it is not NaN
          if (isNaN(newValue)) {
            newValue = ''
          }

//          modifiedValue = newValue.toString() + '0'
//          console.log('Money set: ' + newValue)
          // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
          // $emit the event so that parent component gets it
          // console.log('Emit:', newValue)
          this.$emit('input', newValue)
        }
      },
      focused: {
        get: function () {
          return this.focus[0] && this.focus[0] === this.id
        },
        set: function (v) {
          return v
        }
      },
      focusedOther () {
        return this.focus[0] && this.focus[0] !== this.id
      },
      hasError: {
        get: function () {
          var err = false
          var hasValue = this.hasValue(this.displayValue)
          if (this.inputType === 'wager') {
            if (hasValue && this.minStake && this.displayValue < this.minStake) {
              err = 'MIN_STAKE'
            }
            if (hasValue && this.maxStake && this.displayValue > this.maxStake) {
              err = 'MAX_STAKE'
            }
          }
          /*
           if (this.inputType === 'winning') {
           err = hasValue && this.displayValue <= 0 && 'MIN_RETURN'
           }
           */
          return err
        },
        set: function (val) {
          return val
        }
      },
      currencySymbol () {
        return config.app.CURRENCY
      }

    },

    methods: {
      hasValue (v) {
        return v || parseFloat(v) >= 0
      },
      invokeBlur () {
        event.currentTarget.blur()
      },
      change (id) {
//        console.log('change')
        this.setFocus(id)
      },
      setFocus (id) {
//        console.log('setFocus')
        this.$emit('dismissError', this.id, this.hasError)
        this.$emit('setFocus', this.id, true)
      },
      killFocus (id) {
//        console.log('killFocus')
//        console.log('killFocus: ' + this.preventKillFocus)
        if (this.preventKillFocus) {
          return
        }
        var self = this
        clearTimeout(self.toInt)
        self.toInt = setTimeout(function () {
          self.$emit('setFocus', self.id, !true)
          self.focusOn = false
        }, 0)
      },
      clearValue () {
//        console.log('clearValue')
        var self = this
        this.preventKillFocus = true
        self.displayValue = ''
        clearTimeout(self.toInt)
        setTimeout(function () {
          self.$refs.moneyValue.focus()
          self.focusOn = true
          self.preventKillFocus = false
        }, 10)
      }
    },

    created () {
//      console.log('created')
      var self = this
      setTimeout(function () {
        self.$emit('hasError', [self.inputType, self.hasError])
      }, 10)
    },

    mounted () {
    },

    watch: {
      focused (val) {
        var self = this
        if (val) {
          self.focusOn = true
        }
      },
      focusedOther (val) {
        if (val) {
          this.focusOn = false
        }
      },
      hasError (val) {
        this.$emit('hasError', [this.inputType, val])
      },
      focusOn (val) {
        if (typeof val === 'boolean') {
          if (!val && this.hasError) {
            this.$emit('hasError', [this.inputType, this.hasError])
          }
        }
      }
    },

    destroyed () {
//      console.log('destroyed')
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"

  .money-input {
    position: relative;
    text-align: left;
    background-color: #fff;
    border: 1px solid #CFD6DB;
    border-radius: 2px;
    padding: 6px 1px 3px 5px;

    .currency {
      position: absolute;
      bottom: 4px;
      padding-right: 3px;
      font-weight: bold;
      font-size: 16px
    }
    label {
      position: absolute;
      font-size: 12px;
      letter-spacing: 0.075em;
    }
    &.focused {
      border-color: #1493FF;
      label {
        color: #31A0FD;
      }
      .clear-btn {
        display: inline-block;
      }
      &.hasError {
        label {
          color: #ff0000;
        }
      }
    }
    &.focused.hasError {

    }
    &.focusedOther {
      /*background-color: #e0e0e0;*/
    }

    &.hasError {
      color: #ff0000;
      border-color: #ff0000;
    }

    .stakeChange,
    input {
      position: relative;
      height: 40px;
      padding: 14px 30px 0 14px;
    // font-weight: bold;
      line-height: 20px;
      border: 0px solid #f7f7f7;
      width: 80px;
      width: 100%;
      box-shadow: none;
      /*background-color: #fff;*/
      text-align: left;
      font-size: 16px;
      letter-spacing: 0.05em
    }

    .stakeChange {
      padding-right: 0px;
      line-height: 26px;
      white-space: nowrap;
      position: absolute;
      overflow: hidden;
      top: 7px;
      left: 0;
      .stakeNew {
        display block
        font-size: 14px
        line-height: 13px
        color: #ea913c
      }
      .stakeOld {
        text-decoration: line-through
        font-size: 12px
        line-height: 13px
        display: block
        position: absolute
        left 20px
      }
    }

    input:focus {
      outline: none;
    }

    input.statusToConfirm-Rejected {
      text-decoration: line-through
    }

    input.invisible {
      opacity: 0;
    }

    .clear-btn{
      /*display: none;*/
      position: absolute;
      bottom: 15px;
      right: 5px;
      button {
        width: 20px;
        height: 20px;
      // background-color: #1493FF;
      // border-radius: 50%;
        color: #fff;
        font-weight: bold;
    }
  }
  .error-badge{
    /*display: none;*/
    position: absolute;
    bottom: 12px;
    right: 5px;
    width: 20px;
    height: 20px;
    font-weight: bold;
    text-align: center;

  }
  }


  .SBbetSlip.hasErrors {
    .money-input {
      &.hasError {
        /*border-color: #ff0000;*/
      }
    }
  }

  .money-input.input-only {
    display: inline-block;
    text-align: center;
    border: 0px solid gray;
    background-color: transparent;
  // padding: 2px;

    label {
      color:#1493FF;
      /*display: none;*/
      display: block
      left: 0px
      top: 17px
      width: 100%;
      text-align: right;
      padding-right: 10px;
    }

    .currency {
      display: none
    }

    input {
      height: auto;
      padding: 0;
      border: 0px solid silver
    // width: 120px;
      /*background-color: #fff;*/
      /*text-align: center;*/
    // padding: 11px 1px;
      border-radius: 2px;
      color: transparent
    }
    .clear-btn{
      right: 7px;
    }
    .error-badge {
    // display: none;
    }

    &.focused{
      input {
        border-color: #1493FF;
      }
    }
    &.focused,
    &.non-empty {
      input {
        color: #000
        outline: none
        border-width 1px
        background-color: #fff
        padding: 17px 1px 3px 18px
      }
      label {
        text-transform: uppercase
        letter-spacing 0.5px
        padding-left: 5px
        padding-right: 0px
        text-align: left
        top: 5px
        left 3px
        z-index: 10
      }
      .currency {
        position: absolute;
        bottom: 7px;
        left: 8px;
        z-index: 11
        display: block
      }
    }
  }

  .no-spinners {
    letter-spacing: 1px;
    -moz-appearance:textfield;
  }

  .no-spinners::-webkit-outer-spin-button,
  .no-spinners::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .clear-btn
    button
      background  #f2f2f2
      border 1px solid #939eae
      .v-icon
        font-size 14px

</style>
