<template>
  <div class="page-content account">
    <div v-if="personalDataAdditionalUploadNeeded && !mobileNumberAdditionalUploadNeeded">
      <h1>{{ $t('Account.Verification.Aristotle.Verify.Title') }}</h1>
      <!-- Verify personal data info block -->
      <p v-html="$t('Account.Verification.Aristotle.Verify.Info')"></p>
    </div>
    <div v-if="mobileNumberAdditionalUploadNeeded && !personalDataAdditionalUploadNeeded">
      <h1>{{ $t('Account.Verification.Customer.MobileNumberOwnership.Verify.Title') }}</h1>
      <!-- Verify mobile phone ownership info block -->
      <p v-html="$t('Account.Verification.Customer.MobileNumberOwnership.Verify.Info')"></p>
    </div>
    <div v-if="personalDataAdditionalUploadNeeded && mobileNumberAdditionalUploadNeeded">
      <h1>{{ $t('Account.Verification.Customer.IdAndMobileNumberOwnership.Verify.Title') }}</h1>
      <!-- Verify personal data and mobile phone ownership info block -->
      <p v-html="$t('Account.Verification.Customer.IdAndMobileNumberOwnership.Verify.Info')"></p>
    </div>
    <div v-if="personalDataAdditionalUploadNeeded">
      <!-- List A info block -->
      <div>
        <span class="list-title" v-html="$t('Account.Verification.Aristotle.Verify.ListA.Title')"></span>
        <p class="list-info" v-html="$t('Account.Verification.Aristotle.Verify.ListA.Info')"></p>
        <div class="control-block">
          <ul>
            <li v-for="item in imageTypesListA">
              {{ item.Text }}
            </li>
          </ul>
        </div>
      </div>
      <br>
      <!-- List B info block -->
      <div>
        <span class="list-title" v-html="$t('Account.Verification.Aristotle.Verify.ListB.Title')"></span>
        <p class="list-info" v-html="$t('Account.Verification.Aristotle.Verify.ListB.Info')"></p>
        <div class="control-block">
          <ul>
            <li v-for="item in imageTypesListB">
              {{ item.Text }}
            </li>
          </ul>
        </div>
      </div>
      <br>
      <!-- List C info block -->
      <div>
        <span class="list-title" v-html="$t('Account.Verification.Aristotle.Verify.ListC.Title')"></span>
        <p class="list-info" v-html="$t('Account.Verification.Aristotle.Verify.ListC.Info')"></p>
        <div class="control-block">
          <ul>
            <li v-for="item in imageTypesListC">
              {{ item.Text }}
            </li>
          </ul>
        </div>
      </div>
      <br>
    </div>
    <div v-if="mobileNumberAdditionalUploadNeeded">
      <!-- List D info block -->
      <div v-if="imageTypesListD && imageTypesListD.length > 0">
        <span class="list-title" v-html="$t('Account.Verification.Aristotle.Verify.ListD.Title')"></span>
        <p class="list-info" v-html="$t('Account.Verification.Aristotle.Verify.ListD.Info')"></p>
        <div class="control-block">
          <ul>
            <li v-for="item in imageTypesListD">
              {{ item.Text }}
            </li>
          </ul>
        </div>
      </div>
      <br>
    </div>
    <!-- Upload documents info block -->
    <p v-html="$t('Account.Verification.Aristotle.Verify.Upload.Info', {extList: allowedExt()})"></p>
    <!-- Upload form -->
    <div class="pd verify ctsform  upload-doc-form">
      <form>
        <div v-if="personalDataAdditionalUploadNeeded">
          <!-- List A upload -->
          <div class="pd-verify" >
            <h2>{{ $t('Account.Verification.Aristotle.Verify.ListA') }}</h2>
            <!-- LIST A IDENTIFICATION TYPE -->
            <div class="control-block cs" :class="{ 'filled': imageTypeA }">
              <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                v-model="imageTypeA"
                id="imageTypeA"
                :items="imageTypesListAOptions"
                @change="changedImageType(imageTypeA, 'a')"
                label=""
              ></v-select>
              <label class="control-label">{{ $t('Account.Verification.Aristotle.Verify.IdentificationType') }}<span class="control-label-required"> *</span></label>
            </div>
            <!-- FILE A MAX SIZE INFO BASED ON THE SELECTED IDENTIFICATION TYPE FOR LIST A -->
            <div class="control-block">
              <p v-if="fileASizeMax" v-html="$t('Account.Verification.Aristotle.Verify.Upload.MaxSize', {order: 1, size: fileASizeMax})"></p>
            </div>
            <!-- FILE A -->
            <div class="control-block">
              <label id="qa-choose-file-a" :class="{ 'input-file-disabled': !imageTypeA, 'input-file': imageTypeA}">
                <input style="display:none" type="file" @change="onFileASelected" :disabled="!imageTypeA" name="listA" ref="inputA" />{{ $t('Account.Verification.Aristotle.Verify.Upload.ChooseFile') }}
              </label>&nbsp;
              <span v-if="fileAName">{{ fileAName }}</span>
            </div>
            <!-- FILE A VALIDATION -->
            <div>
              <div class="vmsg invalid" v-if="errorMessages.imageAMissing" v-html="$t('Account.Verification.Aristotle.Upload.MissingFile', { typeId: getSelectedIdentificationTypeText(imageTypeA) })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageASize" v-html="$t('Account.Verification.Aristotle.Upload.InvalidSize', { size: fileASizeMax })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageAExtension" v-html="$t('Account.Verification.Aristotle.Upload.InvalidExtension', {extList: allowedExt()})"></div>
            </div>
          </div>
          <!-- List B upload -->
          <div class="pd-verify">
            <h2>{{ $t('Account.Verification.Aristotle.Verify.ListB') }}</h2>
            <!-- LIST B IDENTIFICATION TYPE -->
            <div class="control-block cs" :class="{ 'filled': imageTypeB }">
              <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                v-model="imageTypeB"
                id="imageTypeB"
                :items="imageTypesListBOptions"
                @change="changedImageType(imageTypeB, 'b')"
                label=""
              ></v-select>
              <label class="control-label">{{ $t('Account.Verification.Aristotle.Verify.IdentificationType') }}<span class="control-label-required"> *</span></label>
            </div>
            <!-- FILE B MAX SIZE INFO BASED ON THE SELECTED IDENTIFICATION TYPE FOR LIST B -->
            <div class="control-block">
              <p v-if="fileBSizeMax" v-html="$t('Account.Verification.Aristotle.Verify.Upload.MaxSize', {order: 2, size: fileBSizeMax})"></p>
            </div>
            <!-- FILE B -->
            <div class="control-block">
              <label id="qa-choose-file-b" :class="{ 'input-file-disabled': !imageTypeB, 'input-file': imageTypeB}">
                <input style="display:none" type="file" @change="onFileBSelected" :disabled="!imageTypeB" name="listB" ref="inputB" />{{ $t('Account.Verification.Aristotle.Verify.Upload.ChooseFile') }}
              </label>&nbsp;
              <span v-if="fileBName">{{ fileBName }}</span>
            </div>
            <!-- FILE B VALIDATION -->
            <div>
              <div class="vmsg invalid" v-if="errorMessages.imageBMissing" v-html="$t('Account.Verification.Aristotle.Upload.MissingFile', { typeId: getSelectedIdentificationTypeText(imageTypeB) })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageBSize" v-html="$t('Account.Verification.Aristotle.Upload.InvalidSize', { size: fileBSizeMax })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageBExtension" v-html="$t('Account.Verification.Aristotle.Upload.InvalidExtension', {extList: allowedExt()})"></div>
            </div>
          </div>
          <!-- List C upload -->
          <div class="pd-verify">
            <h2>{{ $t('Account.Verification.Aristotle.Verify.ListC') }}</h2>
            <!-- LIST C IDENTIFICATION TYPE -->
            <div class="control-block cs" :class="{ 'filled': imageTypeC }">
              <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                v-model="imageTypeC"
                id="imageTypeC"
                :items="imageTypesListCOptions"
                @change="changedImageType(imageTypeC, 'c')"
                label=""
              ></v-select>
              <label class="control-label">{{ $t('Account.Verification.Aristotle.Verify.IdentificationType') }}</label>
            </div>
            <!-- FILE C MAX SIZE INFO BASED ON THE SELECTED IDENTIFICATION TYPE FOR LIST C -->
            <div class="control-block">
              <p v-if="fileCSizeMax" v-html="$t('Account.Verification.Aristotle.Verify.Upload.MaxSize', {order: 3, size: fileCSizeMax})"></p>
            </div>
            <!-- FILE C -->
            <div class="control-block">
              <label id="qa-choose-file-c" :class="{ 'input-file-disabled': !imageTypeC, 'input-file': imageTypeC}">
                <input style="display:none" type="file" @change="onFileCSelected" :disabled="!imageTypeC" name="listC" ref="inputC" />{{ $t('Account.Verification.Aristotle.Verify.Upload.ChooseFile') }}
              </label>&nbsp;
              <span v-if="fileCName">{{ fileCName }}</span>
            </div>
            <!-- FILE C VALIDATION -->
            <div>
              <div class="vmsg invalid" v-if="errorMessages.imageCMissing" v-html="$t('Account.Verification.Aristotle.Upload.MissingFile', { typeId: getSelectedIdentificationTypeText(imageTypeC) })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageCSize" v-html="$t('Account.Verification.Aristotle.Upload.InvalidSize', { size: fileCSizeMax })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageCExtension" v-html="$t('Account.Verification.Aristotle.Upload.InvalidExtension', {extList: allowedExt()})"></div>
            </div>
          </div>
        </div>
        <div v-if="mobileNumberAdditionalUploadNeeded">
          <!-- List D upload -->
          <div class="pd-verify" v-if="imageTypesListD && imageTypesListD.length > 0">
            <h2>{{ $t('Account.Verification.Aristotle.Verify.ListD') }}</h2>
            <!-- LIST D IDENTIFICATION TYPE -->
            <div class="control-block cs" :class="{ 'filled': imageTypeD }">
              <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                v-model="imageTypeD"
                id="imageTypeD"
                :items="imageTypesListDOptions"
                @change="changedImageType(imageTypeD, 'd')"
                label=""
              ></v-select>
              <label class="control-label">{{ $t('Account.Verification.Aristotle.Verify.IdentificationType') }}<span class="control-label-required"> *</span></label>
            </div>
            <!-- FILE D MAX SIZE INFO BASED ON THE SELECTED IDENTIFICATION TYPE FOR LIST D -->
            <div class="control-block">
              <p v-if="fileDSizeMax" v-html="$t('Account.Verification.Aristotle.Verify.Upload.MaxSize', {order: 4, size: fileDSizeMax})"></p>
            </div>
            <!-- FILE D -->
            <div class="control-block">
              <label id="qa-choose-file-d" :class="{ 'input-file-disabled': !imageTypeD, 'input-file': imageTypeD}">
                <input style="display:none" type="file" @change="onFileDSelected" :disabled="!imageTypeD" name="listD" ref="inputD" />{{ $t('Account.Verification.Aristotle.Verify.Upload.ChooseFile') }}
              </label>&nbsp;
              <span v-if="fileDName">{{ fileDName }}</span>
            </div>
            <!-- FILE D VALIDATION -->
            <div>
              <div class="vmsg invalid" v-if="errorMessages.imageDMissing" v-html="$t('Account.Verification.Aristotle.Upload.MissingFile', { typeId: getSelectedIdentificationTypeText(imageTypeD) })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageDSize" v-html="$t('Account.Verification.Aristotle.Upload.InvalidSize', { size: fileDSizeMax })"></div>
              <div class="vmsg invalid" v-if="errorMessages.imageDExtension" v-html="$t('Account.Verification.Aristotle.Upload.InvalidExtension', {extList: allowedExt()})"></div>
            </div>
          </div>
        </div>
        <!-- UPLOAD -->
        <div class="form-actions">
          <v-btn color="success" x-large @click.stop="onUpload" :disabled="isDisabled()"><span>{{ $t('Account.Verification.Aristotle.Verify.Upload') }}</span></v-btn>
        </div>
      </form>

      <!-- processing dialog -->
      <ProcessingDialog
        v-model="dialog"
        :isDialogPersistent="true"
        :isProcessing="isProcessing"
        :isSuccess="!transactionError"
        :processingTitle="$t('Account.Verification.Aristotle.Upload.Dialog.Processing.Title')"
        :processingText="$t('Account.Verification.Aristotle.Upload.Dialog.Processing.Text')"
        :successTitle="$t('Account.Verification.Aristotle.Upload.Dialog.Success.Title')"
        :successText="$t('Account.Verification.Aristotle.Upload.Dialog.Success.Text')"
        :errorTitle="$t('Account.Verification.Aristotle.Upload.Dialog.Error.Title')"
        :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
        @close="closeVerificationDialog">
        <div slot="text-error">
          <p v-if="brandKey !== 'sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Verification.Aristotle.Upload.Dialog.Error.Text') }}</span></p>
          <p class="response-error">{{ transactionError }}</p>
          <p v-html="$t('Account.Verification.Aristotle.Upload.Dialog.Error.Text.ContactSupport')"></p>
        </div>
      </ProcessingDialog>
    </div>
  </div>
</template>

<script>
  import lib from '@/library'
  import store from '@/store'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'
  import Validation from '@/components/mixins/Validation'
  export default {
    mixins: [
      Branding,
      Validation
    ],
    name: 'VerificationPD',
    components: {
      ProcessingDialog
    },
    data: () => ({
      imageTypes: [],
      imageTypesListA: [],
      imageTypesListB: [],
      imageTypesListC: [],
      imageTypesListD: [],
      imageTypeA: undefined,
      imageTypeB: undefined,
      imageTypeC: undefined,
      imageTypeD: undefined,
      fileASizeMax: null,
      fileBSizeMax: null,
      fileCSizeMax: null,
      fileDSizeMax: null,
      dialog: false,
      isProcessing: false,
      transactionError: null,
      fileAName: null,
      fileBName: null,
      fileCName: null,
      fileDName: null,
      errorMessages: {
        imageAMissing: null,
        imageAExtension: null,
        imageASize: null,
        imageBMissing: null,
        imageBExtension: null,
        imageBSize: null,
        imageCMissing: null,
        imageCExtension: null,
        imageCSize: null,
        imageDMissing: null,
        imageDExtension: null,
        imageDSize: null
      }
    }),
    methods: {
      fetchDocumentTypes () {
        lib.kansas.iwparams({})
          .then(response => {
            if (response && response.data && response.data.imagetypes) {
              this.imageTypes = response.data.imagetypes
              this.imageTypes.forEach(val => {
                switch (val.Tag && val.Tag.toLowerCase()) {
                  case 'a':
                    this.imageTypesListA.push(val)
                    break
                  case 'b':
                    this.imageTypesListB.push(val)
                    break
                  case 'c':
                    this.imageTypesListC.push(val)
                    break
                  case 'd':
                    this.imageTypesListD.push(val)
                    break
                }
              })
            }
          }).catch((error) => {
            console.log('fetch image types error')
            console.log(error)
          })
      },
      changedImageType (selectedImageType, tag) {
        this.imageTypes.forEach(imageType => {
          if (imageType.ID === selectedImageType) {
            let sizeMax = Math.floor((100 * imageType.SizeKB / 1024)) / 100
            switch (tag) {
              case 'a':
                this.fileASizeMax = sizeMax
                this.$refs.inputA.value = ''
                this.fileAName = null
                this.errorMessages.imageAMissing = null
                this.errorMessages.imageASize = null
                this.errorMessages.imageAExtension = null
                break
              case 'b':
                this.fileBSizeMax = sizeMax
                this.$refs.inputB.value = ''
                this.fileBName = null
                this.errorMessages.imageBMissing = null
                this.errorMessages.imageBSize = null
                this.errorMessages.imageBExtension = null
                break
              case 'c':
                this.fileCSizeMax = sizeMax
                this.$refs.inputC.value = ''
                this.fileCName = null
                this.errorMessages.imageCMissing = null
                this.errorMessages.imageCSize = null
                this.errorMessages.imageCExtension = null
                break
              case 'd':
                this.fileDSizeMax = sizeMax
                this.$refs.inputD.value = ''
                this.fileDName = null
                this.errorMessages.imageDMissing = null
                this.errorMessages.imageDSize = null
                this.errorMessages.imageDExtension = null
                break
            }
          }
        })
      },
      onFileASelected (event) {
        let target = event.target.files[0]
        this.fileAName = (target && target.name) || null
        if (target) {
          this.errorMessages.imageAMissing = false
          let targetSizeMB = Math.floor((100 * target.size / 1024 / 1024)) / 100
          if (targetSizeMB > this.fileASizeMax) {
            this.errorMessages.imageASize = true
            this.errorMessages.imageAExtension = false
          } else if (!target.name.toLowerCase().match(this.allowedExtensions)) {
            this.errorMessages.imageASize = false
            this.errorMessages.imageAExtension = true
          } else {
            this.errorMessages.imageASize = false
            this.errorMessages.imageAExtension = false
          }
        } else {
          if (this.imageTypeA) {
            this.errorMessages.imageAMissing = true
          } else {
            this.errorMessages.imageAMissing = false
          }
          this.errorMessages.imageASize = false
          this.errorMessages.imageAExtension = false
        }
      },
      onFileBSelected (event) {
        let target = event.target.files[0]
        this.fileBName = (target && target.name) || null
        if (target) {
          this.errorMessages.imageBMissing = false
          let targetSizeMB = Math.floor((100 * target.size / 1024 / 1024)) / 100
          if (targetSizeMB > this.fileBSizeMax) {
            this.errorMessages.imageBSize = true
            this.errorMessages.imageBExtension = false
          } else if (!target.name.toLowerCase().match(this.allowedExtensions)) {
            this.errorMessages.imageBSize = false
            this.errorMessages.imageBExtension = true
          } else {
            this.errorMessages.imageBSize = false
            this.errorMessages.imageBExtension = false
          }
        } else {
          if (this.imageTypeB) {
            this.errorMessages.imageBMissing = true
          } else {
            this.errorMessages.imageBMissing = false
          }
          this.errorMessages.imageBSize = false
          this.errorMessages.imageBExtension = false
        }
      },
      onFileCSelected (event) {
        let target = event.target.files[0]
        this.fileCName = (target && target.name) || null
        if (target) {
          this.errorMessages.imageCMissing = false
          let targetSizeMB = Math.floor((100 * target.size / 1024 / 1024)) / 100
          if (targetSizeMB > this.fileCSizeMax) {
            this.errorMessages.imageCSize = true
            this.errorMessages.imageCExtension = false
          } else if (!target.name.toLowerCase().match(this.allowedExtensions)) {
            this.errorMessages.imageCSize = false
            this.errorMessages.imageCExtension = true
          } else {
            this.errorMessages.imageCSize = false
            this.errorMessages.imageCExtension = false
          }
        } else {
          if (this.imageTypeC) {
            this.errorMessages.imageCMissing = true
          } else {
            this.errorMessages.imageCMissing = false
          }
          this.errorMessages.imageCSize = false
          this.errorMessages.imageCExtension = false
        }
      },
      onFileDSelected (event) {
        let target = event.target.files[0]
        this.fileDName = (target && target.name) || null
        if (target) {
          this.errorMessages.imageDMissing = false
          let targetSizeMB = Math.floor((100 * target.size / 1024 / 1024)) / 100
          if (targetSizeMB > this.fileDSizeMax) {
            this.errorMessages.imageDSize = true
            this.errorMessages.imageDExtension = false
          } else if (!target.name.toLowerCase().match(this.allowedExtensions)) {
            this.errorMessages.imageDSize = false
            this.errorMessages.imageDExtension = true
          } else {
            this.errorMessages.imageDSize = false
            this.errorMessages.imageDExtension = false
          }
        } else {
          if (this.imageTypeD) {
            this.errorMessages.imageDMissing = true
          } else {
            this.errorMessages.imageDMissing = false
          }
          this.errorMessages.imageDSize = false
          this.errorMessages.imageDExtension = false
        }
      },
      createFormData () {
        let fData = new FormData()
        let inputA = this.$refs.inputA
        let inputB = this.$refs.inputB
        let inputC = this.$refs.inputC
        let inputD = this.$refs.inputD

        if (this.imageTypeA && inputA.files[0]) {
          fData.append(this.imageTypeA, inputA.files[0])
        }
        if (this.imageTypeB && inputB.files[0]) {
          fData.append(this.imageTypeB, inputB.files[0])
        }
        if (this.imageTypeC && inputC.files[0]) {
          fData.append(this.imageTypeC, inputC.files[0])
        }
        if (this.imageTypeD && inputD.files[0]) {
          fData.append(this.imageTypeD, inputD.files[0])
        }
        return fData
      },
      onUpload () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          let formData2Upload = this.createFormData()
          let eM = 'cannot read property data of undefined' // upload from drive - android 9 (SUCO100)
          store.dispatch('uploadImages', formData2Upload)
            .then((response) => {
              if (response && response.exceptionType && response.message) {
                this.transactionError = response.message
                let errM = response.message.replace(/'/g, '').toLowerCase()
                if (errM === eM) {
                  this.transactionError = this.$t('Account.Verification.Aristotle.Upload.Dialog.Error.UnsupportedLocation')
                }
              } else {
                this.isProcessing = false
              }
            })
            .catch((err) => {
              this.transactionError = err.message || this.$t('Account.Verification.Aristotle.Upload.Dialog.Error.Generic')
              let errM = err.message && err.message.replace(/'/g, '').toLowerCase()
              if (errM === eM) {
                this.transactionError = this.$t('Account.Verification.Aristotle.Upload.Dialog.Error.UnsupportedLocation')
              }
            })
            .finally(() => {
              this.isProcessing = false
            })
        } else {
          console.log('error on form')
        }
      },
      getSelectedIdentificationTypeText (typeId) {
        let typeName = null
        this.imageTypes.forEach(imageType => {
          if (imageType.ID === typeId) {
            typeName = imageType.Text
          }
        })
        return typeName
      },
      isAnyUnpopulatedField () {
        if (this.imageTypeA && this.$refs.inputA && !this.$refs.inputA.files[0]) {
          this.errorMessages.imageAMissing = true
        }
        if (this.imageTypeB && this.$refs.inputB && !this.$refs.inputB.files[0]) {
          this.errorMessages.imageBMissing = true
        }
        if (this.imageTypeC && this.$refs.inputC && !this.$refs.inputC.files[0]) {
          this.errorMessages.imageCMissing = true
        }
        if (this.imageTypeD && this.$refs.inputD && !this.$refs.inputD.files[0]) {
          this.errorMessages.imageDMissing = true
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
      closeVerificationDialog () {
        if (!this.transactionError) {
          this.$router.push({name: 'account-non-verified'})
        }
      },
      allowedExt () {
        let extensions = this.allowedExtensions
        if (extensions) {
          extensions = extensions.replace('\\.(', '').replace(')$', '')
          let allEx = extensions && extensions.split('|')
          let lastExtension = allEx && allEx[allEx.length - 1]
          let extToShow = allEx && allEx.join(', ')
          extToShow = extToShow && extToShow.replace(', ' + lastExtension, ' and ' + lastExtension)
          return extToShow
        }
        return ''
      },
      isDisabled () {
        if (this.personalDataAdditionalUploadNeeded && this.mobileNumberAdditionalUploadNeeded) {
          return !this.imageTypeA || !this.imageTypeB || (this.imageTypesListD && this.imageTypesListD.length > 0 && !this.imageTypeD)
        } else if (this.personalDataAdditionalUploadNeeded && !this.mobileNumberAdditionalUploadNeeded) {
          return !this.imageTypeA || !this.imageTypeB
        } else if (!this.personalDataAdditionalUploadNeeded && this.mobileNumberAdditionalUploadNeeded) {
          return this.imageTypesListD && this.imageTypesListD.length > 0 && !this.imageTypeD
        } else {
          return false
        }
      }
    },
    computed: {
      allowedExtensions () {
        if (this.brandKey === 'sb' && window.ctsautoconf.STATE === 'CO') {
          return this.vldAllowedFileExtensionUploadDocExt
        } else {
          return this.vldAllowedFileExtensionUploadDoc
        }
      },
      aristotleVerificationStatus () {
        return store.getters['getAristotleVerificationStatus']
      },
      manualVerificationStatus () {
        return store.getters['getManualVerificationStatus']
      },
      m2p () {
        return store.getters['getM2P']
      },
      p2p () {
        return store.getters['getP2P']
      },
      personalDataAdditionalUploadNeeded () {
        return this.aristotleVerificationStatus === 'failed' && this.manualVerificationStatus === 'notsent'
      },
      mobileNumberAdditionalUploadNeeded () {
        return this.p2p === 'failed' && this.m2p === 'notsent'
      },
      imageTypesListAOptions () {
        var self = this
        var items = [] // [{text: 'Please select question', value: '', disabled: true}]
        for (var i = 0; i < self.imageTypesListA.length; i++) {
          var item = {
            text: self.imageTypesListA[i].Text,
            value: self.imageTypesListA[i].ID
          }
          items.push(item)
        }
        return items
      },
      imageTypesListBOptions () {
        var self = this
        var items = [] // [{text: 'Please select question', value: '', disabled: true}]
        for (var i = 0; i < self.imageTypesListB.length; i++) {
          var item = {
            text: self.imageTypesListB[i].Text,
            value: self.imageTypesListB[i].ID
          }
          items.push(item)
        }
        return items
      },
      imageTypesListCOptions () {
        var self = this
        var items = [] // [{text: 'Please select question', value: '', disabled: true}]
        for (var i = 0; i < self.imageTypesListC.length; i++) {
          var item = {
            text: self.imageTypesListC[i].Text,
            value: self.imageTypesListC[i].ID
          }
          items.push(item)
        }
        return items
      },
      imageTypesListDOptions () {
        var self = this
        var items = [] // [{text: 'Please select question', value: '', disabled: true}]
        for (var i = 0; i < self.imageTypesListD.length; i++) {
          var item = {
            text: self.imageTypesListD[i].Text,
            value: self.imageTypesListD[i].ID
          }
          items.push(item)
        }
        return items
      }
    },
    mounted () {
      this.fetchDocumentTypes()
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .page-content.account
    flex-direction column
    @media mobile-big-and-below
      padding 10px
    h1
      text-transform: uppercase
      text-align center
    h1:not(:first-child)
      padding 20px 0
    h2
      color red
    .verify
      cursor default
      &.pd
        padding-bottom 0
      .pd-verify
        margin 5px
        border 1px solid #1f375b
        padding 10px
        border-radius 5px
    .list-title
      color red
      font-weight bold
    .list-info
      font-style italic
  .control-label-required
    color red
  .response-error
    font-size 18px
    font-weight bold
  .input-file-disabled
    background #dbdbdb !important
    color: #666;
    padding 5px 15px
  .input-file {
    background: #1a9ddd repeat scroll 0 0 !important;
    padding 5px 15px
    color: #fff
  }
  input[type=text]
  .cs.control-block
    margin-bottom 0 !important
  .custom-select
    >>>.v-input__icon
      display none
    >>>.v-select__slot
      background: transparent !important
      border: 0px !important
      z-index 5
    >>>.v-input__slot
      &:after
      &:before
        display none !important
    &.v-input--is-focused + .control-label
      background-color #f6f6f6 !important
      padding-top 0
    &.v-select
      >>>.v-select__selections
        color: #505050
        font-weight: bold
        font-size: 14px
        white-space: normal
        line-height: 14px
.v-menu__content
  .v-select-list
    >>>.v-list__tile
      height auto
      line-height normal
      font-size 14px !important
      margin 10px 0
      color: rgba(0,0,0,.87) !important
      .v-list__tile__title
        height auto
        line-height normal
        white-space: normal
      &.v-list__tile--disabled
        color: rgba(0,0,0,.57) !important
</style>
