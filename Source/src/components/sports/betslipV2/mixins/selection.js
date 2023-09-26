import Vue from 'vue'
import store from '@/store'
import Branding from '@/components/mixins/Branding'
import priceFormat from '@/library/priceFormat'
import hcpFormat from '@/library/hcpFormat'
import tsStart from '@/components/common/tsStart.vue'

export default {
  name: 'SelectionRegular',

  mixins: [
    Branding
  ],

  props: ['id', 'currentBetSlipState', 'tab', 'allowedBetTypesAndReturns', 'parlayStake', 'betsNo', 'allowedMultiSingles'],

  components: {
    tsStart
  },

  data () {
    return {
      allowedBetTypesAndReturn: {},
      stateLimitToUpdate: 2,
      priceUp: false,
      priceDown: false,
      hcpUp: false,
      hcpDown: false,
      doNotMarkChanges: false,
      timeOuts: {},
      timeOutsDrv: {},
      changed: {price: 0, currenthandicap: 0}
    }
  },

  computed: {
    selection () {
      return this.id ? store.getters['sbBetslipState/getStoredSelectionById'](this.id) : {}
    },
    idFoSelection () {
      return this.id && this.selection && this.selection.idfoselection
    },
    derivativeSelection () {
      var tab = this.isSGM ? 'REGULAR' : this.tab
      return tab !== 'TEASER' && this.id ? store.getters['sbBetslipState/getDerivative'](this.id, tab) : {}
    },
    derivativeId () {
      return this.derivativeSelection && this.derivativeSelection.idfoselection
    },
    optedIn: {
      // getter
      get: function () {
        return store.getters['sbBetslipState/optedIn'][this.tab]
      },
      // setter
      set: function (newValue) {
//          console.log('selected newValue: ' + newValue)
      }
    },
    showCheckbox () {
      return store.getters['sbBetslipState/betslipCheckboxesForSelections'][this.tab]
    },
    isLive () {
      return this.id && this.idfoevent ? store.getters['sbBetslipState/isEventLive'](this.idfoevent) : false
    },
    liveBettingDataSourceType () {
      return store.getters['livebettingState/liveBettingDataSourceType']
    },
    liveSelection () {
      return this.id && this.selection ? store.getters['sbBetslipState/getSelectionById'](this.id, true) : {}
    },
    idfomarket () {
      return store.getters['sbBetslipState/getIdfoMarketById'](this.id)
    },
    idfoevent () {
      return store.getters['sbBetslipState/getIdfoEventById'](this.id)
    },
    market () {
      return this.id && this.selection ? store.getters['sbBetslipState/getStoredMarketById'](this.id) : {}
    },
    marketName () {
      return this.id && ((this.derivativeSelection && this.derivativeSelection.market) || (this.market && this.market.name))
    },
    selectionMarketName () {
      return this.id && ((this.market && this.market.name) || '')
    },
    derivativeMarketName () {
      return this.id && ((this.derivativeSelection && this.derivativeSelection.market) || '')
    },
    eventName () {
      return this.id && this.market && this.market.eventname
    },
    selectionName () {
      return this.id && this.selection && this.selection.name
    },
    pitcherNames () {
      return (this.market &&
        !this.market.isoutright &&
        this.market.idfosporttype === 'BASEBALL' &&
        // this.market.derivativetypes && this.market.derivativetypes.indexOf('PP') > -1 &&
        // this.market.pitcherhacode !== 'AP' &&
        this.market.awaypitchername && this.market.homepitchername &&
        {'awaypitchername': this.market.awaypitchername, 'homepitchername': this.market.homepitchername}) || false
    },
    canBePlacedAsSingle () {
      let betType = (this.allowedBetTypesAndReturn && this.allowedBetTypesAndReturn.BetType) || 'S'
      return this.tab === 'REGULAR' &&
        (this.allowedMultiSingles || (!this.allowedMultiSingles && this.betsNo === 1)) &&
        this.id && this.selection && this.selection.csvavailablebettypes && this.selection.csvavailablebettypes.includes(betType)
    },
    price () {
      var p
      var selection = this.derivativeSelection &&
        this.derivativeSelection.currentpricedown &&
        this.derivativeSelection.currentpriceup ? this.derivativeSelection : this.selection
        // && (!this.derivativeSelection.derivativetype || this.derivativeSelection.derivativetype === 'HP') ? this.derivativeSelection : this.selection
      //
//        p = this.selection && this.selection.price
      if (selection && selection.currentpricedown && selection.currentpriceup) {
        p = this.formatSelectionPrice(selection)
      }
      return p
    },
    priceValue () {
      return this.id && this.priceFormatted && parseFloat(this.priceFormatted)
    },
    priceLive () {
      var p = 0
      if (this.id && this.liveSelection && this.liveSelection.idfoselection) {
        var selection = this.liveSelection
        p = selection && selection.price
        if (selection.currentpricedown && selection.currentpriceup) {
          p = this.formatSelectionPrice(selection)
        } else {
          p = priceFormat.formatOdds(p)
        }
        return parseFloat(p)
      }
    },
    handicap () {
      var selection = this.derivativeSelection && this.derivativeSelection.currentmatchhandicap ? this.derivativeSelection : this.selection
      return this.id && selection && hcpFormat.formatHandicap(selection, true)
    },
    handicapLive () {
      return this.id && this.liveSelection && this.liveSelection.idfoselection && hcpFormat.getHandicap(this.liveSelection, true)
    },
    handicapValue () {
      return this.id && this.handicapFormatted && parseFloat(this.handicapFormatted)
    },
    marketLive () {
      return this.id ? store.getters['sbBetslipState/getMarketById'](this.id) : {}
    },
    clearMarkings () {
      return store.getters['sbBetslipState/clearMarkings']
    },
    isClosed () {
      return this.selection && this.selection.isclosed
    },
    isSuspended () {
      return this.selection && !this.selection.isclosed && !this.selection.istradable
    },
    closed () {
//        return this.selection && this.selection.isclosed
//        console.log('compute closed for: ' + this.id)
      var self = this
      var isLiveClosed = function () {
        let isClosed = false
        if (!self.marketLive) {
//            console.log('No live market')
          isClosed = true
        } else {
          if (self.marketLive['@deleted']) {
//              console.log('Market deleted')
            isClosed = true
          } else if (self.liveBettingDataSourceType === 'PUSH' && (!self.marketLive.selections || (self.marketLive.selections && !self.marketLive.selections.length))) {
//              console.log('No live selections')
            isClosed = true
          } else if (self.marketLive.selections && self.marketLive.selections.length) {
            let sl = self.marketLive.selections.find(function (s) {
              return s.idfoselection === self.id
            })
            if (!sl || (sl && !sl.currentpriceup)) {
//                console.log('Empty live selection')
              isClosed = true
            }
          }
        }
        return isClosed
      }
      //
      var closed = this.isLive ? isLiveClosed() : this.selection && this.selection.isclosed
      /*
       if (closed) {
       console.log('compute closed for (' + this.id + '): ' + closed)
       console.log(self.marketLive)
       }
       if (this.closeCheck && !closed) {
       console.log('compute closed for (' + this.id + '): ' + closed)
       }
       */
      return closed
    },
    suspended () {
//        return this.selection && !this.selection.isclosed && !this.selection.istradable
      var suspended = this.isLive ? this.marketLive && !this.closed && !this.marketLive.istradable : this.selection && !this.selection.isclosed && !this.selection.istradable
//        console.log('compute suspended: ' + suspended)
      return suspended
    },
    interRelated () {
      return store.getters['sbBetslipState/interRelated']
    },
    isInterRelated () {
      return this.interRelated && this.interRelated[this.id]
    },
    isOddsBoost () {
      var selection = this.selection
      return selection && selection.csvpricetypes && selection.csvpricetypes.includes('XP') &&
        ((selection.estimatepricedown && selection.estimatepriceup) || selection.isInjectedFrom3rdParty)
    },
    isForSinglesOnly () {
      return this.selection && this.selection.csvavailablebettypes && this.selection.csvavailablebettypes.length === 1 && this.selection.csvavailablebettypes[0] === 'S'
    },
    disableOptedIn () {
      return this.currentBetSlipState > 0 || this.isForSinglesOnly
    },
    isBBenabled () {
      return store.getters['sbBetslipState/isBBenabled']
    },
    isForBB () {
      return this.isBBenabled && this.selection && this.selection.isForBB
    },
    showEventTsStart () {
      return store.getters['sbBetslipState/showEventTsStart']
    }
  },

  methods: {
    wbr (input, id) {
      input = input || ''
      var i
      var separator
      var separators = ['@', 'v', 'V', 'vs', 'VS', 'Vs', 'At', 'at', 'v.', 'V.', 'vs.', 'VS.', 'Vs.', '-']
      var parts = []
      for (i = 0; i < separators.length; i++) {
        separator = separators[i]
        parts = input ? input.split(' ' + separator + ' ') : []
        if (parts.length === 2) {
          parts[0] += ' ' + separator + ' '
          break
        }
      }
      return parts[id] || ''
    },
    removeSelection (s) {
      store.dispatch('sbBetslipState/toggleBetslipSelection', [s, null, true])
    },
    formatSelectionPrice (selection) {
      let isoutright = this.market && this.market.isoutright
      return priceFormat.formatSelectionPrice(selection, isoutright)
    },
    priceNum (v, noPrecision) {
      const fractionStrToDecimal = str => str.split('/').reduce((p, c) => p / c)
      if (v) {
        if (typeof v === 'string') {
          v = fractionStrToDecimal(v)
          v = parseFloat(v)
        }
        if (!noPrecision) {
          v = parseFloat(v.toFixed(2))
        }
      }
      return v
    },
    numValue (val) {
      if (val && typeof val === 'string') {
        val = parseFloat(val)
      }
      return val
    },
    checkDerivative (obj) {
      if (this.isSGM) {
        return
      }
      var self = this
      let key = obj.key
      self.changed[key] = self.changed[key] || 0
      self.changed[key]++
      clearTimeout(self.timeOutsDrv[key])
      self.timeOutsDrv[key] = setTimeout(function () {
        // console.log('checkDerivative')
        store.dispatch('sbBetslipState/updateDerivative', {selection: self.selection, changed: self.changed})
        self.changed = {}
      }, 0)
    },
    setBetSlipChange (obj) {
      var self = this
      // let key = obj.key
      // self.changed[key] = self.changed[key] || 0
      // self.changed[key]++
      clearTimeout(self.timeOuts[obj.key])
      self.timeOuts[obj.key] = setTimeout(function () {
        store.dispatch('sbBetslipState/setBetSlipChange', obj)
        store.dispatch('sbBetslipState/scheduleGetABTnR', 0.1)
        // self.changed = {}
      }, 0)
    },
    updateOptedIn (sport) {
      // console.log('updateOptedIn')
      store.dispatch('sbBetslipState/scheduleGetABTnR', 0.000016)
    }
  },

  created () {
  },

  mounted () {
  },

  watch: {
    derivativeSelection (newVal, oldVal) {
      var self = this
      if (newVal.active !== oldVal.active) {
        Vue.set(self, 'doNotMarkChanges', true)
        setTimeout(function () {
          self.doNotMarkChanges = false
          Vue.set(self, 'doNotMarkChanges', false)
        }, 300)
      }
    },
    allowedBetTypesAndReturns: {
      immediate: true,
      handler (newVal, oldVal) {
        // console.log('Watch allowedBetTypesAndReturns')
        let val = (newVal && (newVal[this.derivativeId] || newVal[this.id])) || {}
        Vue.set(this, 'allowedBetTypesAndReturn', val)
      }
    },
    priceLive: {
      immediate: true,
      handler (newVal, oldVal) {
        // console.log('WATCHER: selection.priceLive: ' + oldVal + ' => ' + newVal)
        if (this.currentBetSlipState < this.stateLimitToUpdate) {
          if (newVal && this.selection) {
            Vue.set(this.selection, 'price', this.liveSelection.price)
            Vue.set(this.selection, 'currentpriceup', this.liveSelection.currentpriceup)
            Vue.set(this.selection, 'currentpricedown', this.liveSelection.currentpricedown)
            //
            // this.selection.isPitcherSource || this.selection.isBuyPointsSource
            if (this.tab !== 'TEASER' && oldVal) {
              this.checkDerivative({key: 'price', id: this.id, checkDerivative: true})
            }
          }
        }
      }
    },
    price: {
      immediate: true,
      handler (newVal, oldVal) {
        var doUpdate = false
        newVal = this.priceNum(newVal)
        oldVal = this.priceNum(oldVal)
        // console.log('WATCHER: selection.priceLocal (tab: ' + this.tab + '): ' + oldVal + ' => ' + newVal)
        if (!this.doNotMarkChanges) {
          if (newVal > oldVal) {
            doUpdate = true
            this.priceUp = this.tab !== 'TEASER' && true
            this.priceDown = false
          } else if (newVal < oldVal) {
            doUpdate = true
            this.priceUp = false
            this.priceDown = this.tab !== 'TEASER' && true
          } else {
            this.priceUp = false
            this.priceDown = false
          }
        } else {
          this.priceUp = false
          this.priceDown = false
        }
        //
        if (doUpdate && this.currentBetSlipState < this.stateLimitToUpdate && this.tab !== 'TEASER') {
          this.setBetSlipChange({key: 'price', id: this.id})
        }
      }
    },
    handicapLive: {
      immediate: true,
      handler (newVal, oldVal) {
        // console.log('Watch handicapLive: ' + oldVal + ' => ' + newVal)
        if (this.currentBetSlipState < this.stateLimitToUpdate) {
          if (this.selection) {
            Vue.set(this.selection, 'currenthandicap', this.liveSelection.currenthandicap)
            Vue.set(this.selection, 'currentmatchhandicap', this.liveSelection.currenthandicap)
            //
            if (oldVal) {
              this.checkDerivative({key: 'currenthandicap', id: this.id, checkDerivative: true})
            }
          }
        }
      }
    },
    handicap: {
      immediate: true,
      handler (newVal, oldVal) {
        // console.log('Watch hcp: ' + oldVal + ' => ' + newVal)
        var self = this
        var doUpdate = false
        newVal = self.numValue(newVal)
        oldVal = self.numValue(oldVal)
        if (!self.doNotMarkChanges && self.selection && self.selection.hadvalue && typeof oldVal === 'number' && typeof newVal === 'number') {
          if (newVal > oldVal) {
            doUpdate = true
            self.hcpUp = true
            self.hcpDown = false
          } else if (newVal < oldVal) {
            doUpdate = true
            self.hcpUp = false
            self.hcpDown = true
          } else {
            self.hcpUp = false
            self.hcpDown = false
          }
        } else {
          self.hcpUp = false
          self.hcpDown = false
        }
        if (doUpdate && this.currentBetSlipState < this.stateLimitToUpdate && this.tab !== 'SGM') {
          this.setBetSlipChange({key: 'currenthandicap', id: this.id})
        }
      }
    },
    closed: {
      immediate: true,
      handler (newVal, oldVal) {
//          console.log('Watch: closed: ' + oldVal + ' => ' + newVal)
        this.closeCheck = newVal
        if (this.currentBetSlipState < this.stateLimitToUpdate && typeof newVal === 'boolean') {
          Vue.set(this.selection, 'isclosed', newVal)
        }
      }
    },
    suspended: {
      immediate: true,
      handler (newVal, oldVal) {
//        console.log('Watch: suspended: ' + oldVal + ' => ' + newVal)
        if (this.currentBetSlipState < this.stateLimitToUpdate && typeof newVal === 'boolean') {
          Vue.set(this.selection, 'istradable', !newVal)
        }
      }
    },
    isclosed: {
      immediate: true,
      handler (newVal, oldVal) {
//          console.log('Watch: isclosed: ' + oldVal + ' => ' + newVal)
        if (this.currentBetSlipState < this.stateLimitToUpdate && typeof newVal === 'boolean' && this.tab !== 'SGM') {
          this.setBetSlipChange({key: 'closed', id: this.selectionId, remove: !newVal})
        }
      }
    },
    issuspended: {
      immediate: true,
      handler (newVal, oldVal) {
//        console.log('Watch: issuspended: ' + oldVal + ' => ' + newVal)
        if (this.currentBetSlipState < this.stateLimitToUpdate && typeof newVal === 'boolean' && this.tab !== 'SGM') {
          this.setBetSlipChange({key: 'suspended', id: this.selectionId, remove: !newVal})
        }
      }
    },

    clearMarkings (clear) {
      var self = this
      if (clear) {
        self.priceUp = false
        self.priceDown = false
        self.hcpUp = false
        self.hcpDown = false
      }
    }
  },

  destroyed () {
  }
}
