<template>
    <div class="pnc-container">
        <h1 v-if="!accountSummaryFlow">{{ $t('Account.PickAndClaim.Title') }}</h1>
        <loader v-if="showLoader"></loader>
        <div class="available-promos" v-else-if="isAvailabePromExist && !showLoader">
            <div class="available-promos-header" v-html="$t('Account.PickAndClaim.AvailablePromotions')"></div>
            <p class="select-text">{{ $t('Account.PickAndClaim.Select') }}</p>
            <div class="promos"  v-for="(available, key) in groupedAvailableProms" :key="key">
                <div v-if="key !== 'null'" class="grouped-promos">
                    <div class="grouped-promos--header">
                        <h4>{{ available[0].CampaignName }}</h4>
                        <span @click="openDialog(available[0], true, true)">{{ $t('Account.PickAndClaim.DetailsText') }} <v-icon>chevron_right</v-icon></span>
                    </div>
                    <div class="grouped-promos--container" v-for="prom in available" :key="prom.IdPromotion">
                        <div>
                            <input type="radio" :name="key" :id="prom.IdPromotion" v-model="valuesForRadioFields[prom.IdCampaign]" :value="prom">
                            <label :for="prom.IdPromotion">{{ prom.Description }}</label>
                        </div>
                        <span @click="openDialog(prom, true)">{{ $t('Account.PickAndClaim.DetailsText') }} <v-icon>chevron_right</v-icon></span>
                    </div>
                    <div class="form-actions">
                        <v-btn :disabled="Object.keys(valuesForRadioFields[available[0].IdCampaign]).length === 0 ? true : false" @click="openDialog(valuesForRadioFields[available[0].IdCampaign])" class="success">{{ $t('Account.PickAndClaim.Claim') }}</v-btn>
                    </div>
                </div>
                <div v-else>
                    <div v-for="prom in available" :key="prom.IdPromotion" class="standalone-promos">
                        <div>
                            <label :for="prom.IdPromotion">{{ prom.Description }}</label>
                            <span @click="openDialog(prom, true)">{{ $t('Account.PickAndClaim.DetailsText') }} <v-icon>chevron_right</v-icon></span>
                        </div>
                        <v-btn @click="openDialog(prom)" class="success">{{ $t('Account.PickAndClaim.Claim') }}</v-btn>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="no-available-promos">
            <div class="no-available-promos-header" v-html="$t('Account.PickAndClaim.AvailablePromotions')"></div>
            <p class="no-promos-text">{{ $t('Account.PickAndClaim.NoAvailablePromotions') }}</p>
            <div class="icon-no-available-promos"></div>
        </div>
        <div v-if="isAvailabeClaimedPromExist && !showLoader" class="claimed-promos">
            <div class="claimed-promos-header" v-html="$t('Account.PickAndClaim.Claimed')"></div>
            <p class="claimed-text">{{ $t('Account.PickAndClaim.ClaimedText') }}</p>
            <table>
              <tr>
                <th>{{ $t('Account.PickAndClaim.ColumnPromotions') }}</th>
                <th>{{ $t('Account.PickAndClaim.ColumnCampaign') }}</th>
                <th>{{ $t('Account.PickAndClaim.ColumnStatus') }}</th>
              </tr>
              <tr v-for="claimed in claimedProm" :key="claimed.IdPromotion">
                <td class="claimed-prom-name">{{ claimed.Name }}</td>
                <td>{{ claimed.CampaignName }}</td>
                <td>{{ claimed.Status }}</td>
              </tr>
            </table>
        </div>
        <pick-and-claim-dialog @claimPromotion="claimPromotion" @closeDialog="closePncDialog" v-if="showDetailsDialog.isActive" :dialogDetail="showDetailsDialog"></pick-and-claim-dialog>
    </div>
    
</template>

<script>
import lib from '@/library'
import Loader from '@/components/common/Loader.vue'
import PickAndClaimDialog from './PickAndClaimDialog.vue'

export default {
  components: {
    Loader,
    PickAndClaimDialog
  },
  data () {
    return {
      availabeProm: [],
      claimedProm: [],
      showLoader: false,
      groupedAvailableProms: null,
      valuesForRadioFields: null,
      showDetailsDialog: {
        isActive: false,
        isDetails: false,
        isCampaign: false,
        promotion: null
      }
    }
  },
  computed: {
    isAvailabePromExist () {
      return this.availabeProm.length > 0
    },
    isAvailabeClaimedPromExist () {
      return this.claimedProm.length > 0
    },
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    }
  },
  methods: {
    openDialog (promotion, details = false, campaign = false) {
      this.showDetailsDialog.isActive = true
      this.showDetailsDialog.isDetails = details
      this.showDetailsDialog.isCampaign = campaign
      this.showDetailsDialog.promotion = promotion
    },
    claimPromotion (payload) {
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'setPcPromotions4Customer', payload)
          .then(response => {
            this.availabeProm = response.result.Response.Available
            this.claimedProm = response.result.Response.Claimed
            this.formatAvailableProms()
            this.makeValueForRadioFields()
            this.showLoader = false
            this.closePncDialog()
            resolve(response)
          }).catch((error) => {
            console.log(error)
            this.showLoader = false
            reject(error)
          })
      })
    },
    closePncDialog () {
      this.showDetailsDialog.isActive = false
      this.showDetailsDialog.isDetails = false
      this.showDetailsDialog.promotion = null
    },
    formatAvailableProms () {
      const result = {}
      for (let prom in this.availabeProm) {
        if (result[this.availabeProm[prom].IdCampaign]) {
          result[this.availabeProm[prom].IdCampaign].push(this.availabeProm[prom])
        } else {
          result[this.availabeProm[prom].IdCampaign] = new Array(this.availabeProm[prom])
        }
      }
      this.groupedAvailableProms = result
    },
    makeValueForRadioFields () {
      const result = {}
      for (let campaign in this.groupedAvailableProms) {
        if (campaign !== 'null') {
          result[campaign] = {}
        }
      }
      this.valuesForRadioFields = result
    },
    fetchAllPcPromotions () {
      this.showLoader = true
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'getAllPcPromotions4Customer')
          .then(response => {
            this.availabeProm = response.result.Available
            this.claimedProm = response.result.Claimed
            this.formatAvailableProms()
            this.makeValueForRadioFields()
            this.showLoader = false
            resolve(response)
          }).catch((error) => {
            console.log(error)
            this.showLoader = false
            reject(error)
          })
      })
    }
  },
  mounted () {
    this.fetchAllPcPromotions()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.pnc-container
  padding 0 10px
  @media mobile-big-and-below
    padding 0 20px
  h1
    // max-width: 400px
    margin: 30px auto
  >>>.spinner
      margin-left: auto
      margin-right: auto
  .claimed-promos
    // max-width: 400px
    margin: 0 auto
    .claimed-promos-header
        border 2px dashed #52b735
        color #52b735
        text-align: center
        font-family 'Open sans Bold'
        padding 5px
    .claimed-text
        max-width: 245px
        padding 5px
        text-align: center
        margin: 0 auto
        font-size: 13px
    table
      border-bottom: solid 1px #e2e2e2
      .claimed-prom-name
        color #52b735
  .no-available-promos
    margin: 0 auto
    .icon-no-available-promos
      display: block
      background-image: url(icons-path'/'promos_x'.svg')
      height: 80px !important
      width: 80px !important
      margin 15px auto 25px
    .no-available-promos-header
        background: var(--pnc-promos-available-header-bgr)
        padding 10px 
        text-align: center
        color #fff
        font-size 16px
        text-align: left
        display: flex
        align-items: center
        text-align: center
        font-family: 'Open Sans Bold'
        line-height normal
        margin 0 -10px
    .no-promos-text
        max-width: 245px
        padding 20px 5px 5px 5px
        text-align: center
        margin: 0 auto
        font-size: 14px
        @media mobile-big-and-below
          font-size: 14px
  .available-promos
    margin: 0 auto
    .available-promos-header
        margin 0 -10px
        background: var(--pnc-promos-available-header-bgr)
        padding 10px 
        text-align: center
        color #fff
        font-size 16px
        text-align: center
        display: flex
        align-items: center
        text-align: left
        font-family: 'Open Sans Bold'
        line-height normal

    .select-text
        max-width: 245px
        padding 20px 0
        text-align: center
        margin: 0 auto
        font-size: 14px
    .promos
        border-bottom: solid 1px #e2e2e2
        padding-bottom 7px
        margin-bottom: 5px
        .standalone-promos
            display flex
            justify-content: space-between
            align-items: center
            padding 0 5px
            div
                display flex
                flex-direction: column
                padding-left: 10px
                label
                  font-family 'Open sans Bold'
                span
                    font-size 12px
                    display flex
                    align-items center
                    cursor pointer
                    i
                        color var(--pnc-promos-primary-color)
        .grouped-promos
            border 2px dashed var(--pnc-promos-primary-color)
            background-color: #F2F2F2
            padding 10px
            .v-btn.success:disabled
              cursor not-allowed
              pointer-events: all !important
            .grouped-promos--container
                display: flex
                justify-content: space-between
                align-items: center
                div
                    display: flex
                    align-items: center
                    justify-content: center
                    margin-bottom 5px
                    input[type="radio"]
                        width 15px
                        height: 15px
                        appearance: none
                        -webkit-appearance: none
                        border: 1px solid var(--pnc-promos-primary-color)
                        background-color: transparent
                        border-radius: 50%;
                        margin-right: 10px
                        box-shadow: 0 0 0 1px var(--pnc-promos-primary-color)
                        cursor pointer
                    input[type="radio"]:checked
                        outline 2px solid var(--pnc-promos-primary-color)
                        background-color: var(--pnc-promos-primary-color)
                        border: 2px solid #fff
                    label
                        font-family 'Open sans Bold'
                        margin-bottom: 2px
                        cursor pointer
                span
                    font-size 12px
                    display flex
                    align-items center
                    cursor pointer
                    i
                        color var(--pnc-promos-primary-color)
            .grouped-promos--header
                display: flex
                flex-direction: column
                justify-content: center
                align-items: center
                h4
                    margin 0
                span
                    font-size 12px
                    display flex
                    align-items center
                    cursor pointer
                    i
                        color var(--pnc-promos-primary-color)
        .form-actions
            display: flex
            justify-content: center
    
</style>