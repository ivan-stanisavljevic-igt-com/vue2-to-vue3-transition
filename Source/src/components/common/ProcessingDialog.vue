<template>
  <v-dialog
    content-class="sightline-transaction-dialog"
    v-model="dialog"
    width="500"
    :persistent="isDialogPersistent"
    >
    <v-card>
      <v-card-title class="headline grey lighten-3" primary-title v-if="isTitleVisible">
        <slot name="title">
          <div v-if="isProcessing">
            <span>{{ processingTitle }}</span>
          </div>
          <div v-else>
            <span v-if="isSuccess" id="dialog_success_title">{{ successTitle }}</span>
            <span v-else class="red--text" id="dialog_error_title">{{ errorTitle }}</span>
          </div>
        </slot>
      </v-card-title>

      <v-card-text class="dialog-content">
        <slot v-if="isProcessing" name="text-processing">
          <div class="dialog-processing">
            <v-progress-circular class="circular-progress" indeterminate></v-progress-circular>
            <span id="qa-processingText">{{ processingText }}</span>
          </div>
        </slot>
        <div v-else>
          <slot v-if="isSuccess" name="text-success">
              <p class="generic-icon-note"><v-icon color="success" class="mr-1">check_circle</v-icon><span id="qa-successText">{{ successText }}</span></p>
          </slot>
          <slot v-else name="text-error">
            <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span id="qa-errorText">{{ errorText }}</span></p>
          </slot>
        </div>

      </v-card-text>

      <v-divider v-if="showActions" class="actions-divider"></v-divider>
      <v-card-actions v-if="showActions">
        <slot name="actions">
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogClose" :disabled="isProcessing"><span id="qa-closeBtnText">{{ closeBtnText }}</span></v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: { },
    isDialogPersistent: { type: Boolean, default: false }, // if true then clicking outside of the dialog will not deactivate it
    showActionsWhileProcessing: { type: Boolean, default: false },
    isTitleVisible: { type: Boolean, default: true },

    isProcessing: { },
    isSuccess: { },

    closeBtnText: { type: String, default () { return this.$t('ProcessingDialog.CloseButtonText') } },

    processingTitle: { type: String, default () { return this.$t('ProcessingDialog.Processing.Title') } },
    processingText: { type: String, default () { return this.$t('ProcessingDialog.Processing.Text') } },

    successTitle: { type: String, default () { return this.$t('ProcessingDialog.Success.Title') } },
    successText: { type: String, default () { return this.$t('ProcessingDialog.Success.Text') } },

    errorTitle: { type: String, default () { return this.$t('ProcessingDialog.Error.Title') } },
    errorText: { type: String, default () { return this.$t('ProcessingDialog.Error.Text') } }
  },

  data () {
    return {
      dialog: false
    }
  },

  computed: {
    showActions () {
      if (this.isProcessing) {
        return this.showActionsWhileProcessing
      }
      return true
    }
  },

  methods: {
    dialogClose () {
      this.dialog = false
      this.$emit('close')
    }
  },

  watch: {
    dialog (newVal) {
      this.$emit('input', newVal)
    },

    value (newVal) {
      this.dialog = this.value
    }
  }
}
</script>

<style lang="stylus" scoped>
.inline-block
  display inline-block
.dialog-content
  font-size 16px
  text-align center
  margin-top 14px
  margin-bottom 14px

.dialog-processing
  margin-top 12px
  margin-bottom 12px
.circular-progress
  display inline-block
  position relative
  top -1px
  right 1px
  >>> .v-progress-circular
    width 16px !important
    height 16px !important

.v-dialog.processing-dialog
  padding 0
  border-radius 4px

.circular-progress
  height 22px !important
  width 22px !important

.actions-divider
  margin: 0

</style>
