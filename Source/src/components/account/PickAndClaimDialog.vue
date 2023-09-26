<template>
    <v-dialog
        content-class="pick-and-claim-dialog"
        v-model="show"
        persistent
        max-width="320px">

        <div v-if="dialogDetail.isDetails && dialogDetail.isCampaign" class="pnc-details-dialog">
            <h3>{{ dialogDetail.promotion.CampaignName }}</h3>
            <p>{{ dialogDetail.promotion.CampaignExternalDescription }}</p>
            <v-btn @click="closeDialog" class="close">{{ $t('Dialog.btn.CLOSE') }}</v-btn>
        </div>
        <div v-else-if="dialogDetail.isDetails && !dialogDetail.isCampaign" class="pnc-details-dialog">
            <h3>{{ dialogDetail.promotion.Description }}</h3>
            <p>{{ dialogDetail.promotion.Note }}</p>
            <v-btn @click="closeDialog" class="close">{{ $t('Dialog.btn.CLOSE') }}</v-btn>
        </div>
        <div v-else  class="pnc-claim-dialog">
            <div class="campaign-description" v-if="dialogDetail.promotion.IdCampaign">
                <h2>{{ dialogDetail.promotion.CampaignName }}</h2>
                <p>{{ dialogDetail.promotion.CampaignExternalDescription }}</p>
            </div>
            <div class="promo">
                <v-icon>stars</v-icon>
            </div>
            <div class="promotion-name">{{ dialogDetail.promotion.Description }}</div>
            <p class="promotion-note">{{ dialogDetail.promotion.Note }}</p>
            <div class="claim-buttons">
                <v-btn @click="closeDialog" class="claim-buttons--close">{{ $t('Dialog.btn.CLOSE') }}</v-btn>
                <v-btn @click="claimPromotion" class="claim-buttons--claim">{{ $t('Account.PickAndClaim.Claim') }}</v-btn>
            </div>
        </div>

    </v-dialog>
</template>

<script>
export default {
  props: ['dialogDetail'],
  data () {
    return {
      show: true
    }
  },
  methods: {
    claimPromotion () {
      const payload = {
        'Promotions': [
          {
            'IdPromotion': this.dialogDetail.promotion.IdPromotion,
            'IdCampaign': this.dialogDetail.promotion.IdCampaign,
            'IdProvider': this.dialogDetail.promotion.IdProvider
          }
        ]
      }
      this.$emit('claimPromotion', payload)
    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="stylus">
.pick-and-claim-dialog
    background: var(--pnc-promos-dialog-bgr) !important
    // background: #4986a8 !important
    .pnc-details-dialog
        color: #fff
        text-align: center
        .close
            box-sizing: content-box
            display: block
            margin: 0 auto
            padding 3px 0
            background: transparent !important
            color: #fff
            border: 2px solid #fff
    .pnc-claim-dialog
        color #fff
        .campaign-description
            color #fff
            text-align: center
            max-width: 200px
            margin: 0 auto
        .promotion-name
            max-width: 180px
            margin 10px auto
            text-align: center
            padding: 5px 15px
            border 2px dashed var(--pnc-promos-primary-color)
            // border 2px dashed  var(--account-pages-primary-btn-bgr) !important
        .promotion-note
            margin: 5px 0
            text-align: center
            max-width: 200px
            margin: 0 auto
        .claim-buttons
            display: flex
            justify-content: center
            margin: 10px 0
            .claim-buttons--close
                background: transparent
                // border 2px solid  var(--account-pages-primary-btn-bgr) !important
                // color:  var(--account-pages-primary-btn-bgr) !important
                border 2px solid var(--pnc-promos-primary-color)
                color: var(--pnc-promos-primary-color)
                font-weight 600
                margin-left 0
                margin-right 3px
            .claim-buttons--claim
                // background: var(--account-pages-primary-btn-bgr) !important;
                // border-radius: var(--account-pages-btn-border-radius) !important;
                // color: var(--account-pages-primary-btn-color);
                color: var(--pnc-promos-dialog-bgr)
                font-weight 600
                margin-left 3px
                margin-right 0
                background var(--pnc-promos-primary-button-bgr)

</style>