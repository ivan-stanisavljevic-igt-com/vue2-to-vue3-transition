<template>
  <div class="session-dialog-component">
    <v-dialog content-class="expand overlay-dialog geolocation-dialog" persistent v-model="show" height="90%">
      <template v-if="sessionDialogData.context === 'sessiontime'">
        <div class="header">
          <v-layout align-center>
            <v-flex><h1>{{ $t('SessionTime.Title') }}</h1></v-flex>
          </v-layout>
        </div>
        <div class="geo-content">
          <v-layout align-center>
            <v-flex>
              <div class="gcontent-container">
                <v-card class="gcontent-container-msg"><br><p v-html="$t('SessionTime.Info2', {sessionInMinutes})"></p></v-card>
                <v-card class="gcontent-container-msg"><br><p>{{currentTime}}</p></v-card>
              </div>
            </v-flex>
          </v-layout>
        </div>
        <div class="geo-content">
          <div class="buttons">
            <v-btn block @click.stop="closeDialog()" class="okay-btn"><span>{{ $t('SessionTime.Info3') }}</span></v-btn>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="buttons">
          <v-btn block @click.stop="closeDialog()" class="okay-btn"><span>Close dialog</span></v-btn>
        </div>
      </template>
    </v-dialog>
  </div>
</template>
<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import airBridge from '@/components/mixins/airBridge'
  import config from '@/config'
  // import moment from 'moment'

  export default {
    name: 'geolocation-component',

    mixins: [
      Screen,
      airBridge
    ],

    data () {
      return {
        show: true,
        sessionInMinutes: 0,
        timerId: {},
        currentTime: null
      }
    },

    computed: {
      config () {
        return config
      },
      sessionDialogData () {
        return store.getters['overlayState/getSessionDialogData']
      }
    },

    methods: {
      closeDialog () {
        this.show = !this.show
        if (this.sessionDialogData.context === 'sessiontime') {
          clearInterval(this.timerId)
        }
        store.dispatch('overlayState/deactivateSessionDialog')
      },
      updateCurrentTime () {
        this.currentTime = (new Date()).toLocaleString('en-US', { timeZone: config.app.timeZone })
      }
    },

    created () {
      if (this.sessionDialogData.context === 'sessiontime') {
        var value = Math.round(Math.abs(localStorage.loginTime - Date.now()) / 1000)
        if (value >= 0) {
          var minutes = Math.floor(value / 60)
          this.sessionInMinutes = `${minutes}`
        }
        this.timerId = setInterval(() => {
          var value = Math.round(Math.abs(localStorage.loginTime - Date.now()) / 1000)
          if (value >= 0) {
            var minutes = Math.floor(value / 60)
            this.sessionInMinutes = `${minutes}`
          }
        }, 1000)
      }
      this.currentTime = (new Date()).toLocaleString('en-US', {timeZone: config.app.timeZone})
      setInterval(() => this.updateCurrentTime(), 1 * 1000)
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/css/config';
.v-dialog:not(.dialog--fullscreen) {
  width: 421px;
}
.geolocation-dialog {
  background: transparent;
  padding: 0px;
  border-radius: 4px;
}
.geolocation-dialog .header {
  padding: 15px 15px 10px 15px;
  text-align: center
}

.geolocation-dialog .header h1 {
  margin: 0;
  text-transform: uppercase;
  font-size: 25px;
  letter-spacing: 0.05em;
  line-height: 35px;
  color: #fff;
}

.geolocation-dialog .geo-content {
  line-height: 20px;
  text-align: center;
  color: #818e95;
  padding: 0px 30px;
  margin-top: 10px;
  font-size: 14px
}
.geolocation-dialog .buttons {
  padding-bottom: 20px;
  margin-top: 0;
}

::-webkit-scrollbar
  width: 0px
  background: transparent

.gcontent-container
  display flex
  flex-direction column
  max-height 210px
  overflow scroll
</style>
