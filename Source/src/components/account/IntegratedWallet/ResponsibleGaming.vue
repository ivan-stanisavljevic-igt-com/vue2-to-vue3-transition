<template>
<div v-if="navigationItems" class="container" id="rg-container">
  <!-- [SUCO239;SUBO-710] Requested by DGE and Dobney Nicholas-->
  <div v-if="mobileBigAndBelow && brandKey === 'sb' && state === 'NJ'" class="account-heading">
    <a @click.stop="go2ResponsibleGaming">
      <icon name="icon-acc-rg-stop"></icon>{{ $t('Account.SelfExclusion') }}
    </a>
  </div>
  <div v-if="(mobileBigAndBelow && brandKey !== 'sb') || (mobileBigAndBelow && state !== 'NJ')" class="account-heading">
    <icon name="icon-acc-rg"></icon>{{ $t('Account.ResponsibleGaming') }}
  </div>
  <div v-if="(brandKey === 'sb' && state === 'NJ') && mobileBigAndBelow" class="rg-title" v-html="$t('Accounting.ResponsibleGaming.title')"></div> 
  <div class="expansion-container">
    <v-expansion-panel v-for="(component, index) in navigationItems[0].fwnavigationitems" :key="index" expand :value="expandedPanel.includes(component.cssclass) ? 0 : 1" :id="[component.cssclass + '-panel']">
      <v-expansion-panel-content :data-id="component.action" :id="component.cssclass" lazy>
        <template v-slot:header>
          <div class="title-wrap" :data-header="[component.cssclass]" :data-component="[component.action]">
            <h1>{{ $t(component.area) }}</h1>
          </div>
        </template>
        <component v-bind:is="component.action" :key="componentKeys[component.action]"></component>
      </v-expansion-panel-content>
      <div class="panel-bottom-border"></div>
    </v-expansion-panel>
  </div>
</div>
</template>
<script>
  import store from '@/store'
  import router from '@/router'
  import Screen from '@/components/mixins/Screen'
  import accounting from '@/components/mixins/accounting'
  import config from '@/config'
  import Branding from '@/components/mixins/Branding'

  import AccountSelfExclusionComponent from '@/components/account/AccountSelfExclusionComponent'
  import DepositThresholdComponent from '@/components/account/DepositThresholdComponent'
  import ResponsibleGamingHistoryComponent from '@/components/account/ResponsibleGamingHistoryComponent'
  import Icon from '@/components/common/Icon'
  import Exclusions from '@/components/account/Exclusions/Exclusions'
  import Limits from '@/components/account/Limits/Limits'
  import CoolOff from '@/components/account/Exclusions/CoolOffBreak'
  import SelfExclusion from '@/components/account/Exclusions/SelfExclusion'
  import LimitsV2 from '@/components/account/Limits/LimitsV2'
  import DepositLimits from '@/components/account/Limits/V3RI/DepositLimits'
  import WagerLimits from '@/components/account/Limits/V3RI/WagerLimits'
  import TimeLimits from '@/components/account/Limits/V3RI/TimeLimits'
  import TimeoutV3 from '@/components/account/Exclusions/V3RI/TimeoutV3'
  import SelfExclusionV3 from '@/components/account/Exclusions/V3RI/SelfExclusionV3'

  export default {
    mixins: [Screen, accounting, Branding],
    components: {
      AccountSelfExclusionComponent,
      DepositThresholdComponent,
      ResponsibleGamingHistoryComponent,
      Icon,
      Exclusions,
      Limits,
      CoolOff,
      SelfExclusion,
      LimitsV2,
      DepositLimits,
      WagerLimits,
      TimeLimits,
      TimeoutV3,
      SelfExclusionV3
    },
    data () {
      return {
        componentKeys: {
          'Limits': 0,
          'AccountSelfExclusionComponent': 1,
          'DepositThresholdComponent': 2,
          'ResponsibleGamingHistoryComponent': 3,
          'Exclusions': 4,
          'CoolOff': 5,
          'SelfExclusion': 6,
          'DepositLimits': 7,
          'WagerLimits': 8,
          'TimeLimits': 9,
          'TimeoutV3': 10,
          'SelfExclusionV3': 11
        }
      }
    },
    methods: {
      go2ResponsibleGaming () {
        if (router.currentRoute.path !== '/info/responsible-gaming') {
          router.push({ path: '/info/responsible-gaming' })
        } else return false
      }
    },
    computed: {
      navigationSections () {
        return store.getters['siteNavigationState/navigationSections']
      },
      navigationItems () {
        const accSummComponentsPerState = this.navigationSections && this.navigationSections[`ACCOUNT_SUMMARY_COMPONENTS_${this.state}`]
        const rgPerState = accSummComponentsPerState && accSummComponentsPerState.fwnavigationgroups && accSummComponentsPerState.fwnavigationgroups.filter(navitem => (navitem.text === 'ResponsibleGaming'))
        const accSummComponents = this.navigationSections && this.navigationSections[`ACCOUNT_SUMMARY_COMPONENTS`]
        const rg = accSummComponents && accSummComponents.fwnavigationgroups && accSummComponents.fwnavigationgroups.filter(navitem => (navitem.text === 'ResponsibleGaming'))
        return rgPerState || rg
      },
      headerHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      state () {
        return config.app.autoconf.STATE
      }
    },
    mounted () {
      this.mounted = true
      setTimeout(() => { this.attachEvent('rg-container') }, 300)
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

</style>