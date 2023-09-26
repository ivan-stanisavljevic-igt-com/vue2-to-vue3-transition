<template>
<div v-if="navigationItems" class="container" id="settings-container">
  <div v-if="mobileBigAndBelow" class="account-heading"><icon name="icon-acc-settings"></icon>{{ $t('Account.Settings') }}</div>
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
  import Branding from '@/components/mixins/Branding'
  import accounting from '@/components/mixins/accounting'
  import AccountPersonalDetailsComponent from '@/components/account/AccountPersonalDetailsComponent'
  import NotificationPreferences from '@/components/account/IntegratedWallet/NotificationPreferencesV2'
  import SecuritySettings from '@/components/account/IntegratedWallet/SecuritySettings'
  import Icon from '@/components/common/Icon'
  import ChangePassword from '@/components/account/IntegratedWallet/PasswordChange'

  export default {
    mixins: [Screen, Branding, accounting],
    components: {
      AccountPersonalDetailsComponent,
      NotificationPreferences,
      SecuritySettings,
      Icon,
      ChangePassword
    },
    data () {
      return {
        componentKeys: {
          'AccountPersonalDetailsComponent': 0,
          'NotificationPreferences': 1,
          'ChangePassword': 2,
          'SecuritySettings': 3
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
        const accSettingsPerState = accSummComponentsPerState && accSummComponentsPerState.fwnavigationgroups && accSummComponentsPerState.fwnavigationgroups.filter(navitem => (navitem.text === 'AccountSettings'))
        const accSummComponents = this.navigationSections && this.navigationSections[`ACCOUNT_SUMMARY_COMPONENTS`]
        const accSettings = accSummComponents && accSummComponents.fwnavigationgroups && accSummComponents.fwnavigationgroups.filter(navitem => (navitem.text === 'AccountSettings'))
        return accSettingsPerState || accSettings
      },
      headerHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      state: () => window.ctsautoconf.STATE
    },
    mounted () {
      this.mounted = true
      setTimeout(() => { this.attachEvent('settings-container') }, 300)
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

</style>
