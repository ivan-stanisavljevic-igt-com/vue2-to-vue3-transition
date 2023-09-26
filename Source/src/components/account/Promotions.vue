<template>
<div v-if="navigationItems && navigationItems.length > 0" class="container" id="summary-container">
  <div v-if="mobileBigAndBelow" class="account-heading"><icon name="icon-acc-promotions"></icon>{{ $t('Account.Promotions.Title') }}</div>
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
  import Screen from '@/components/mixins/Screen'
  import accounting from '@/components/mixins/accounting'
  import PickAndClaim from '@/components/account/PickAndClaim'
  import ReferAFriend from '@/components/account/ReferAFriend'
  import Icon from '@/components/common/Icon'
  import AccountVouchers from '@/components/account/AccountVouchers'

  export default {
    mixins: [Screen, accounting],
    components: {
      PickAndClaim,
      Icon,
      ReferAFriend,
      AccountVouchers
    },
    data () {
      return {
        componentKeys: {
          'ReferAFriend': 0,
          'PickAndClaim': 1,
          'AccountVouchers': 2
        }
      }
    },
    methods: {},
    computed: {
      navigationSections () {
        return store.getters['siteNavigationState/navigationSections']
      },
      navigationItems () {
        const accSummComponentsPerState = this.navigationSections && this.navigationSections[`ACCOUNT_SUMMARY_COMPONENTS_${this.state}`]
        const accSummPerState = accSummComponentsPerState && accSummComponentsPerState.fwnavigationgroups && accSummComponentsPerState.fwnavigationgroups.filter(navitem => (navitem.text === 'Promotions'))
        const accSummComponents = this.navigationSections && this.navigationSections[`ACCOUNT_SUMMARY_COMPONENTS`]
        const accSumm = accSummComponents && accSummComponents.fwnavigationgroups && accSummComponents.fwnavigationgroups.filter(navitem => (navitem.text === 'Promotions'))
        return accSummPerState || accSumm
      },
      headerHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      state: () => window.ctsautoconf.STATE
    },
    mounted () {
      this.mounted = true
    //   setTimeout(() => { this.attachEvent('summary-container') }, 300)
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

</style>
