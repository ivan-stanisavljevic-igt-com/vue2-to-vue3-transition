<template>
  <div>
    <!-- RG language -->
    <div>
      <span v-if="brandKey === 'sb'">{{ $t('Account.JoinUs.RGLangage') }}</span>
    </div>

    <!-- T&C -->
    <div class="checkbox-holder">
      <v-checkbox v-model="tc" id="tc" type="checkbox">
          <span slot="label">
            {{ $t('Account.JoinUs.TC1') }}
            <a @click.stop="toggleTandC('open')">{{ $t('Account.JoinUs.TC2') }}</a>
            <span v-if="showHouseRules">,</span>
            <span v-else>{{ $t('Account.JoinUs.TC3') }}</span>
            <a @click.stop="togglePrivacyPolicy('open')">{{ $t('Account.JoinUs.TC4') }}</a>
            <span v-if="showHouseRules">
              {{ $t('Account.JoinUs.TC3') }}
              <a @click.stop="toggleHouseRules('open')">{{ $t('Account.JoinUs.TC5') }}</a>
            </span>
          </span>
      </v-checkbox>
    </div>
    <!-- T&C pop-up -->
    <div class="tandc-popup-container" v-if="termsAndConditionsPopup" :class="{'tandc-iframe': tAndCIFrame}">
      <div class="tandc-popup-child">
        <div class="tandc-popup-content">
          <div class="tc-text" v-if="tAndCText" v-html="tAndCText"></div>
        </div>
        <iframe class="tc-embedded" ref="tAndCondIF" id="tcIFrame" v-if="tAndCIFrame">
        </iframe>
        <div class="form-actions">
          <v-btn class="btn primary-btn" @click="toggleTandC('decline')">{{ $t('Account.JoinUs.Popup.Close') }}</v-btn>
        </div>
      </div>
    </div>
    <!-- Privacy policy pop-up -->
    <div class="tandc-popup-container" v-if="privacyPolicyPopup">
      <div class="tandc-popup-child">
        <div class="tandc-popup-content">
          <div class="tc-text" v-html="privacyContent"></div>
        </div>
        <div class="form-actions">
          <v-btn class="btn primary-btn" @click="togglePrivacyPolicy('decline')">{{ $t('Account.JoinUs.Popup.Close') }}</v-btn>
        </div>
      </div>
    </div>
    <!-- House rules pop-up -->
    <div class="tandc-popup-container" v-if="houseRulesPopup">
      <div class="tandc-popup-child">
        <div class="tandc-popup-content">
          <div class="tc-text" v-html="rulesContent"></div>
        </div>
        <div class="form-actions">
          <v-btn class="btn primary-btn" @click="toggleHouseRules('decline')">{{ $t('Account.JoinUs.Popup.Close') }}</v-btn>
        </div>
      </div>
    </div>
    <!-- T&C VALIDATION -->
    <div>
      <div class="vmsg invalid" v-if="errorMessages.tc" id="err_msg_tc_missing" v-html="$t('Account.Join.ErrorMsg.TC')"></div>
    </div>

    <!-- ATTESTATIONS -->
    <div class="checkbox-holder" v-for="(item, index) in attestations">
      <div @click="attestationClick(attestations[index])">
        <v-checkbox class="control-elm" v-model="attestations[index].value" :id="'attestation_' + attestations[index].idmmattestation" :label="attestations[index].description">
          <template slot="label"><span v-html="attestations[index].description"></span></template>
        </v-checkbox>
      </div>
      <!-- ATTESTATIONS VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages[attestations[index].idmmattestation]" :id="'err_msg_attestation_missing_' + attestations[index].idmmattestation" v-html="$t('Account.Join.ErrorMsg.ConfirmAttestation')"></div>
      </div>
    </div>
    <div class="form-actions">
          <v-btn class="btn confirm-btn" @click.stop="checkAll()">{{$t('Account.JoinUs.CheckAll')}}</v-btn>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import Branding from '@/components/mixins/Branding'
  import lib from '@/library'
  import axios from 'axios'
  import Url from '@/components/mixins/Url'
  import Vue from 'vue'

  export default {
    name: 'RegStep4',
    props: ['currentStep', 'currentStepState', 'registrationDetails'],
    mixins: [
      Branding,
      Url
    ],
    data: () => ({
      termsAndConditionsPopup: false,
      tAndCText: undefined,
      tAndCIFrame: true,
      privacyPolicyPopup: false,
      privacyPolicyContent: '',
      houseRulesPopup: false,
      houseRulesContent: '',
      attestations: [],
      errorMessages: {
        tc: false
      }
    }),
    computed: {
      componentSubmitState () {
        return store.getters['registration/getComponentSubmitState']
      },
      tc: {
        get () {
          return this.registrationDetails.tc || false
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.tc = true
          } else {
            this.errorMessages.tc = false
          }
          this.registrationDetails.tc = value
        }
      },
      showHouseRules () {
        return config.app.autoconf.HOUSE_RULES_REGISTRATION
      },
      privacyContent () {
        return this.privacyPolicyContent
      },
      rulesContent () {
        return this.houseRulesContent
      },
      isTermsAndConditionsMandatory () {
        return config.app.autoconf.TERMS_CONDITIONS_IS_MANDATORY
      }
    },
    methods: {
      isAnyUnpopulatedField () {
        if (this.isTermsAndConditionsMandatory && !this.registrationDetails.tc) {
          this.errorMessages.tc = true
        }
        if (this.attestations && this.errorMessages) {
          this.attestations.map(item => {
            if (!item.value) {
              this.errorMessages[item.idmmattestation] = true
            }
          })
        }
      },
      isEverythingValid () {
        let isValid = true
        this.isAnyUnpopulatedField()
        Object.values(this.errorMessages).forEach(val => {
          if (val) {
            isValid = false
          }
        })
        return isValid
      },
      isFilled () {
        if (this.isEverythingValid()) {
          return true
        }
        return false
      },
      fetchTermsAndConditions () {
        lib.rpcService.callBroker('UserService', 'GetTsAndCsText', {'IDMDLanguage': 'UK', 'versionNumber': null})
          .then(response => {
            if (response && response.result) {
              if (response.result.includes('<html>') || response.result.includes('<head>') || response.result.includes('<body>')) {
                let res = response.result
                let ifr = this.$refs.tAndCondIF
                ifr = ifr && (ifr.contentWindow || (ifr.contentDocument.document || ifr.contentDocument))
                if (ifr) {
                  ifr.document.open()
                  ifr.document.write(res)
                  ifr.document.close()
                }
              } else {
                this.tAndCIFrame = false
                this.tAndCText = response.result
              }
            }
          })
      },
      toggleTandC (param) {
        if (param === 'open') {
          this.termsAndConditionsPopup = true
          this.fetchTermsAndConditions()
        } else if (param === 'accept') {
          this.termsAndConditionsPopup = false
          this.tc = true
        } else if (param === 'decline') {
          this.termsAndConditionsPopup = false
          this.tc = false
        }
      },
      togglePrivacyPolicy (param) {
        if (param === 'open') {
          this.privacyPolicyPopup = true
        } else if (param === 'accept') {
          this.privacyPolicyPopup = false
          this.tc = true
        } else if (param === 'decline') {
          this.privacyPolicyPopup = false
          this.tc = false
        }
      },
      getPrivacyPolicyContent () {
        var self = this
        axios.get(this.mediaServer('/static/static-content/privacy-policy.html')).then(response => {
          self.privacyPolicyContent = response.data
        })
      },
      toggleHouseRules (param) {
        if (param === 'open') {
          this.houseRulesPopup = true
        } else if (param === 'accept') {
          this.houseRulesPopup = false
          this.tc = true
        } else if (param === 'decline') {
          this.houseRulesPopup = false
          this.tc = false
        }
      },
      getHouseRulesContent () {
        var self = this
        axios.get(this.mediaServer('/static/static-content/rules.html')).then(response => {
          self.houseRulesContent = response.data
        })
      },
      fetchAttestations () {
        lib.kansas.iwparams({})
          .then(response => {
            if (response && response.data && response.data.attestations) {
              this.attestations = response.data.attestations
              this.attestations = Vue._.orderBy(this.attestations, 'sortorder', 'asc')
              this.attestations.forEach(val => {
                this.$set(this.errorMessages, val.idmmattestation, false)
                if (this.registrationDetails.attestations) {
                  this.registrationDetails.attestations.forEach(att => {
                    if (att.idmmattestation === val.idmmattestation) {
                      val.value = true
                    }
                  })
                }
              })
            }
          }).catch((error) => {
            console.log('fetch attestations error')
            console.log(error)
          }).finally(() => {
          })
      },
      attestationClick (attestation) {
        if (attestation.value) {
          let objAtt = this.registrationDetails.attestations.find(function (att) {
            return att.idmmattestation === attestation.idmmattestation
          })
          if (!objAtt) {
            this.registrationDetails.attestations.push(attestation)
          }
          this.errorMessages[attestation.idmmattestation] = undefined
        } else {
          this.registrationDetails.attestations = this.registrationDetails.attestations.filter(data => data.idmmattestation !== attestation.idmmattestation)
          this.errorMessages[attestation.idmmattestation] = true
        }
      },
      checkAll () {
        this.tc = true
        this.attestations.forEach(att => {
          att.value = true
          this.attestationClick(att)
        })
      }
    },
    created () {
      this.getPrivacyPolicyContent()
      this.getHouseRulesContent()
      this.fetchAttestations()
    },
    mounted () {
    }
  }
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
.btn.confirm-btn
  text-align: center
  width: 350px
  margin: 5px 0px 0px
  >>>.v-btn__content
    display: inline-block
    width: 100%;
  @media mobile-big-and-below
    width: 100%
</style>
