<template>
  <div class="betSlipTabs" id="betSlipTabs" v-if="!(currentBetSlipState==5 && betSlipStatus.State==2)" >
    <template v-if="!betslipLayout2">
      <div class="betslipHeader">
        <div id="tabBtns" class="tabs is-boxed is-centered is-fullwidth is-toggle">
          <span v-for="t in betSlipTabs" class="tab" :class="{ 'active': tab===t, disabled: true }">
            <a @click="setTab(t)" class="" :class="{ disabled: betsNo===0 }">
              <span>{{ $t('BetSlip.tab.'+t) }}</span>
            </a>
          </span>
        </div>
      </div>
    </template>
    <div class="Tabs" v-if="betsNo">
      <div v-if="tab==='REGULAR'">
        <tab-regular :tab="tab"
                    :betsNo="betsNo"
                    :currentBetSlipState="currentBetSlipState"
                    :allowedBetTypesAndReturns="allowedBetTypesAndReturns[tab].PotentialReturns"
                    :allowedBetTypesAndReturnsXP="allowedBetTypesAndReturns.XP"
                    :betTypeStakes="betTypeStakes[tab]"
                    :betTypeStakesXP="betTypeStakes.XP"
                    :gettingABTnR="gettingABTnR"
                    :interRelated="interRelated"
                    :allowedMultiSingles="allowedMultiSingles"
        ></tab-regular>
      </div>

      <div v-if="tab==='TEASER'">
        <tab-teaser :tab="tab"
                :currentBetSlipState="currentBetSlipState"
                :betsNo="betsNo"
                :allowedBetTypesAndReturns="allowedBetTypesAndReturns[tab]"
                :betTypeStakes="betTypeStakes[tab]"
                :gettingABTnR="gettingABTnR"
                :interRelated="interRelated"
        ></tab-teaser>
      </div>

      <div v-if="tab==='RR'">
        <tab-rr :tab="tab"
                :currentBetSlipState="currentBetSlipState"
                :betsNo="betsNo"
                :allowedBetTypesAndReturns="allowedBetTypesAndReturns[tab].PotentialReturns"
                :betTypeStakes="betTypeStakes[tab]"
                :gettingABTnR="gettingABTnR"
                :interRelated="interRelated"
        ></tab-rr>
      </div>
    </div>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import tabRegular from './tabs/tabRegular.vue'
  import tabRr from './tabs/tabRoundRobin.vue'
  import tabTeaser from './tabs/tabTeaser.vue'

  export default {
    name: 'betSlipTabs',

    mixins: [
    ],

    props: ['tab', 'currentBetSlipState', 'betsNo', 'allowedBetTypesAndReturns', 'betTypeStakes', 'gettingABTnR', 'interRelated', 'allowedMultiSingles', 'betSlipStatus'],

    components: {
      tabRegular,
      tabRr,
      tabTeaser
    },

    data () {
      return {
      }
    },

    computed: {
      betSlipTabs () {
        return store.getters['sbBetslipState/tabs']
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {
      setTab (tab) {
        if (this.currentBetSlipState) {
          return
        }
        store.commit('sbBetslipState/setTab', tab)
//        this.dismissBetSlip(null, !true)
      }
    },

    created () {
    },

    mounted () {
    },

    watch: {

    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  // @import "~@/css/config"
  .betSlipTabs {
    .tabBtns {
      background: #fff;
      padding: 0;
      margin: 0px -4px 5px -4px;
      .Tabs {
        display: flex;
        width: 100%;
        text-align: center;
        .tab {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          border-bottom: solid 2px transparent;
          cursor: pointer;
          a {
            color: #1493ff;
            font-size: 14px;
            display: block;
            height: 100%;
            min-height: 48px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
          }
          &.active {
            border-bottom: solid 2px #2396fc;
            a {
              color: #152a47;
            }
          }
        }
      }
    }
  }
</style>
