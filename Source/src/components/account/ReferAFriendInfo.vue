<template>
    <div class="raf-friend-holder">
        <div v-if="promoActive">
            <div v-for="promo in promos" v-bind:key="promo.PromoCode" class="promotion raf-friend">
                <h3 class="subtitle">{{promo.Description}}</h3>
                <div class="raf_friend_content">
                  <p> {{promo.Note}} </p>
                  <p> {{$t('Account.ReferAFriend.ReferalCodeBellow')}} </p>
                  <div class="code-container">
                      <span class="code">{{promo.PromoCode}}</span>
                      <label  class="copy" v-on:click="copyCode">
                         <icon name="icon-copy-black"></icon> <span class="copySpanText"> {{$t('Account.ReferAFriend.CopyBtn')}}</span>
                      </label>
                      <input type="button" class="copyBtn" > <br>
                  </div>
                  <div class="terms-rate">
                    <!-- <a :href="mediaServer('/static/static-content/raf-promo-terms.html')" class="terms-link">{{$t('Account.ReferAFriend.TermsLink')}}</a> -->
                    <p class="terms-link" @click="toggleRafPromoTerms()">{{$t('Account.ReferAFriend.TermsLink')}}</p>
                    <!-- <span v-if="promo.maxRefferesCount > 0" class="response-rate">{{$t('Account.ReferAFriend.ResponseRate', {refferesCount: promo.RefferesCount, maxRefferesCount: promo.MaxRefferesCount} )}}</span> -->
                    <span v-if="promo.MaxRefferesCount > 0" class="response-rate">{{$t('Account.ReferAFriend.MaxReferrals')}}: {{promo.MaxRefferesCount}} &nbsp;  {{$t('Account.ReferAFriend.Referrals')}}: {{promo.RefferesCount}}</span>
                    <span v-else class="response-rate">{{$t('Account.ReferAFriend.Referrals')}}: {{promo.RefferesCount}}</span>
                    <div class="tandc-popup-container" v-if="rafPromoTermsPopUp">
                      <div class="tandc-popup-child">
                        <div class="tandc-popup-content">
                          <div class="tc-text" v-html="rafPromoTermsHtml"></div>
                        </div>
                        <div class="form-actions">
                          <v-btn class="btn primary-btn" @click="toggleRafPromoTerms()">{{ $t('Account.JoinUs.Popup.Close') }}</v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>{{$t('Account.ReferAFriend.NoPromo')}}</p>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import axios from 'axios'
import Icon from '@/components/common/Icon'
import Url from '@/components/mixins/Url'
import lib from '@/library'
import mobileBridge from '@/library/mobileBridge'

export default {
  name: 'referInfo',
  components: {
    Icon
  },
  mixins: [
    Url
  ],
  data () {
    return {
      clicked: false,
      rafPromoTerms: '',
      rafPromoTermsPopUp: false
    }
  },
  computed: {
    promos () {
      return store.getters['getRafCodes']
    },
    promoActive () {
      return store.getters['getRafCodes'] && store.getters['getRafCodes'].length >= 1
    },
    locationOrigin () {
      return window.location.origin
    },
    rafPromoTermsHtml () {
      return this.rafPromoTerms
    },
    userAgent () {
      return lib.core.userAgent.os.name
    }
  },
  methods: {
    copyCode (event) {
      const el = event.target
      const parentEl = el.closest('.code-container')
      const childEl = parentEl.querySelector('.copySpanText')
      const selectedCode = parentEl.firstChild.textContent
      if (this.userAgent === 'android') {
        mobileBridge.bridgeSendRequest('copyToClipboard', selectedCode)
        childEl.textContent = this.$t('Account.ReferAFriend.CodeCopied')
      } else {
        navigator.clipboard.writeText(selectedCode).then(() => {
          childEl.textContent = this.$t('Account.ReferAFriend.CodeCopied')
        }).catch((err) => {
          console.log(err, ' copy code error')
        })
      }
    },
    getRafPromoTerms () {
      axios.get(this.mediaServer('/static/static-content/raf-promo-terms.html')).then(response => {
        this.rafPromoTerms = response.data
      })
    },
    toggleRafPromoTerms () {
      this.rafPromoTermsPopUp = !this.rafPromoTermsPopUp
    }
  },
  mounted () {
    // const result = store.dispatch('fetchPromoCodes')
    // result.then((res) => {
    //   this.promos = res
    // })
    store.dispatch('fetchPromoCodes')
    this.getRafPromoTerms()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.promotion
  margin-bottom: 20px

.subtitle
  display flex
  font-family 'Open Sans SemiBold'
  margin-top 5px
  font-size 20px
  border-radius 0px
  padding: 10px
  background: #0b4da1
  color #fff
  justify-content space-between
  align-items: center
  @media mobile-big-and-below
    font-size 16px

.code-container
  display: flex
  justify-content: space-around
  margin-top: 30px
  margin-bottom: 30px
  .code
    border: 1px solid #0b4da1
    padding: 5px
    text-align: center
    font-size: 16px
    width: 40%
    @media mobile-big-and-below
      margin-right: 15px
      width: 70%
  .copy
    border 1px solid #0b4da1
    background: lightgrey
    font-size: 16px
    width: 35%
    display flex
    align-items: center
    justify-content: center
    padding: 5px
    @media mobile-big-and-below
      width: 30%
     >>>.igt-icon
      margin-right 5px
  .copyBtn
    display: none

.terms-rate
  display: flex
  justify-content: space-between
  .terms-link
      // color #0b4da1
      text-decoration underline
      cursor pointer
.raf_friend_content
  padding 5px 10px
</style>
