<template>
  <div class="log-dialog">
    <v-dialog :content-class="[message.reason]" :fullscreen="message.fullscreen" height="80%"
              :persistent="message.persistent" v-model="show">
      <template>
        <div class="log-wrapper" :class="[{'filter': active === 0}]">
          <v-tabs
            v-model="active"
            color="cyan"
            dark
            slider-color="yellow"
          >
            <v-tab
              v-for="(n, index) in items"
              :key="n.name + index"
              ripple
              @click="tabClick(n)"
            >
              {{ n.name }}

            </v-tab>
            <v-tab-item
              v-for="(i, index) in items"
              :key="i.name + index"
            >
              <v-expansion-panel v-if="i.name === 'network'">
                <i><b>Network: Success/Failure; Content: Failure only; Media: Static content - Success/Failure</b></i>
                <v-expansion-panel-content
                  v-for="(log) in networkLogs.slice().reverse()"
                  :key="log.dynamicId"
                >
                  <template v-slot:header>
                    <div
                      :class="[{'error-response': log.response.error || log.response.message}, {'success-response': log.response.result || log.response.data || log.response.status === 204}]">
                      <p v-if="log.type === 'api'">{{ log.request.url }}</p>
                      <p v-if="log.type === 'content'">{{ log.response.url }}</p>
                      <p v-if="log.type === 'media'">{{log.request}}</p>
                      <p style="font-size:10px"><b>Request time:</b>
                        {{ String(new Date(log.date).getHours()).padStart(2, '0') }} : {{ String(new Date(log.date).getMinutes()).padStart(2, '0') }} : {{ String(new Date(log.date).getSeconds()).padStart(2, '0') }}
                      </p>
                    </div>
                  </template>
                  <v-card>
                    <v-card-text v-if="log.type === 'api'">
                      <p><b>Params:</b> {{ log.request.params }}</p>
                      <p><b>Payload:</b> {{ log.request.data }}</p>
                      <p><b>IGT-Client-Id:</b> {{ log.request.headers['IGT-Client-Session'] }}</p>
                    </v-card-text>
                    <v-card-text v-if="log.type === 'content'">
                      <p><b>Request:</b> {{ log.response.url }}</p>
                      <p><b>Params:</b> {{ log.response.params }}</p>
                    </v-card-text>
                    <v-card-text v-if="log.type === 'media'">
                    </v-card-text>
                    <div class="divider-wrapper">
                      <div class="divider"></div>
                    </div>
                    <v-card-text>
                      <div class="block word-break" v-if="log.response.result || log.response.data">
                        <p v-if="log.response && log.response.status"><b>Status:</b> {{ log.response.status }}</p>
                        <p v-if="log.response && log.response.result"><b>Result:</b> {{ log.response.result }}</p>
                        <p v-if="log.response && log.response.data"><b>Result:</b> {{ log.response.data }}</p>
                      </div>
                      <div class="block word-break" v-if="(log.response.error || log.response.message) && log.type !== 'media'">
                        <p v-if="log.response.error && log.response.error.Code"><b>Code:</b>
                          {{ log.response.error.Code }}</p>
                        <p v-if="log.response && log.response.status"><b>Status:</b> {{ log.response.status }}</p>
                        <p v-if="log.response && log.response.statusText"><b>Text:</b> {{ log.response.statusText }}</p>
                        <p v-if="log.response && log.response.message"><b>Message:</b> {{ log.response.message }}</p>
                        <p v-if="log.response.error && log.response.error.Message">
                          <b>Message:</b>{{ log.response.error.Message }}</p>
                        <p v-if="log.response.error && log.response.error['InnerError']">
                          <b>InnerError:</b>{{ log.response.error['InnerError'].Message }}</p>
                      </div>
                      <div v-if="log.type === 'media'" class="block word-break">
                        <p v-if="log.response && log.response.response && log.response.response.status"><b>Status:</b> {{ log.response.response.status }}</p>
                        <p v-if="log.response && log.response.status"><b>Status:</b> {{ log.response.status }}</p>
                        <p v-if="log.response && log.response.data"><b>Data:</b> {{ log.response.data }}</p>
                        <p v-if="log.response && log.response.message"><b>Message:</b> {{ log.response.message }}</p>
                        <p v-if="log.response && log.response.statusText"><b>Text:</b> {{ log.response.statusText }}</p>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel v-if="i.name === 'bridge'">
                <v-expansion-panel-content
                  v-for="(log) in bridgeLogs.slice().reverse()"
                  :key="log.dynamicId"
                >
                  <template v-slot:header>
                    <div
                      :class="[{'error-response': log.error}, {'success-response': log.response}]">
                      <p v-if="log && log.method ">{{ log.method }}</p>
                      <p style="font-size:10px"><b>Request time:</b>
                        {{ String(new Date(log.date).getHours()).padStart(2, '0') }}:{{
                          String(new Date(log.date).getMinutes()).padStart(2, '0')
                        }}:{{ String(new Date(log.date).getSeconds()).padStart(2, '0') }}
                      </p>
                    </div>
                  </template>
                  <v-card>
                    <v-card-text class="word-break" v-if="log.error || log.response">
                      <p><b v-if="log.initiator">Request sent by: </b> {{ log.initiator }}</p>
                      <p><b v-if="log.params">Params:</b> {{ log.params }}</p>
                      <p><b v-if="log.data">Data:</b> {{ log.data }}</p>
                      <p><b v-if="log.error">Message:</b> {{ log.error }}</p>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-card v-if="i.name === 'console'">
                <i><b>JavaScript Exception, Vue Exception and Vue Warn only</b></i>
                <v-card-text v-for="(log, index) in consoleLogs.slice().reverse()" :key="index">
                  <p v-if="log.response && log.response.statusText"><b>Error type: </b> {{ log.response.statusText }}</p>
                  <p v-if="log.response && log.response.data && log.response.data.ExceptionType"><b>ExceptionType: </b> {{ log.response.data.ExceptionType }}</p>
                  <p v-if="log.response && log.response.data && log.response.data.Reference"><b>Reference: </b> {{ log.response.data.Reference }}</p>
                  <p v-if="log.response && log.response.data && log.response.data.Message"><b>Message: </b> {{ log.response.data.Message }}</p>
                  <div class="divider-wrapper">
                    <div class="divider"></div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card v-if="i.name === 'media'">
                <i><b>Configuration taken from window object in runtime</b></i>
                <v-card-text v-for="(param, index) in mediaParams" :key="index">
                  <p><b>{{ index }}:</b> {{ param }}</p>
                </v-card-text>
              </v-card>
              <v-card v-if="i.name === 'storage'">
                <i><b>Local Storage and Session Storage</b></i><br>
                <h5><u>Local Storage</u></h5>
                <ul class="word-break">
                  <li v-for="item in allLSkeys">
                    <b>{{item }}</b> : {{ localStorageData[item] }}
                  </li>
                </ul>
                <h5><u>Session Storage</u></h5>
                <ul class="word-break">
                  <li v-for="item in allSSkeys">
                    <b>{{item }}</b> : {{ sessionStorageData[item] }}
                  </li>
                </ul>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
        <div class="btns-holder">
        <div v-if="displayFilter && active === 0" class="filter-container">
          <v-container fluid>
            <v-checkbox v-for="(f, index) in filterOptions" :key="index"
                        v-model="selected"
                        color="indigo"
                        :label="f"
                        :value="f"
            ></v-checkbox>
          </v-container>
        </div>
        <div class="buttons">
            <v-btn depressed color="normal" @click="close()">Close</v-btn>
            <v-btn v-if="active === 0" depressed color="error" @click="clear()">Clear</v-btn>
        </div>
        </div>
      </template>
    </v-dialog>
  </div>
</template>
<script>
import store from '@/store'
import Screen from '@/components/mixins/Screen'
import Session from '@/components/mixins/Session'
import Branding from '@/components/mixins/Branding'

export default {
  name: 'LogDialog',

  mixins: [
    Screen,
    Session,
    Branding
  ],

  data () {
    return {
      show: true,
      active: null,
      items: [
        {index: 0, name: 'network'},
        {index: 1, name: 'bridge'},
        {index: 3, name: 'console'},
        {index: 4, name: 'media'},
        {index: 5, name: 'storage'}
      ],
      selected: ['api', 'content', 'media'],
      filterOptions: ['api', 'content', 'media'],
      displayFilter: true,
      mediaParams: false,
      allLSkeys: false,
      allSSkeys: false,
      localStorageData: false,
      sessionStorageData: false
    }
  },

  computed: {
    message () {
      return store.getters['overlayState/getLogDialogMsg']
    },
    networkLogs () {
      let logs = store.getters['getNetworkLogOutput']
      let arr = []
      if (this.selected.length > 0) {
        for (let i = 0; i < logs.length; i++) {
          if (this.selected.includes(logs[i].type)) {
            arr.push(logs[i])
          }
        }
        return arr
      } else {
        this.selected = ['api', 'content', 'media']
      }
      return logs
    },
    bridgeLogs () {
      return store.getters['getMobileBridgeLogs']
    },
    consoleLogs () {
      return store.getters['getConsoleLogs']
    }
  },

  methods: {
    close () {
      store.dispatch('overlayState/deactivateLogDialog')
    },
    clear () {
      if (this.items[this.active].name === 'network') store.commit('setNetworkLogOutput', [])
      if (this.items[this.active].name === 'bridge') store.commit('setMobileBridgeLogs', [])
    },
    getConfig () {
      this.mediaParams = window.ctsautoconf
    },
    tabClick (tab) {
      if (tab.index === 5) {
        this.localStorageData = false
        this.sessionStorageData = false
        this.allLSkeys = Object.keys(localStorage)
        this.allSSkeys = Object.keys(sessionStorage)
        this.localStorageData = localStorage
        this.sessionStorageData = sessionStorage
      }
    }
  },
  mounted () {
    this.getConfig()
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/css/config';

>>> .v-dialog--active
  height: 80% !important
  overflow-y hidden
  padding: 5px

>>> .v-expansion-panel__header.v-expansion-panel__header
  padding 5px 0px !important
  background-color #FFFFFF !important
  text-align: center
  p
    margin: 0
    overflow-wrap anywhere
>>> .v-tabs__item--active
  border-bottom: 3px solid #003366

.v-card
  //height: 500px
  overflow: scroll
  overflow-x: hidden
  text-align: center

  p
    margin: 0
  ul
    li
      margin: 0

  .v-card__text
    padding 0

  .word-break
    word-break break-word

.divider-wrapper
  display: flex
  justify-content: center
  background: hsl(0, 0%, 20%)
  width: 80%;
  margin: 0 auto

  .divider
    height: 1px
    width: 80%
    background: #1f375b

.error-response
  color: red

.success-response
  color: green

.filter-container
  .container
    display: flex
    .v-input
      margin-top: 0
      height: 40px
.buttons
  display: flex
  margin-top: 0 !important
  justify-content center
  .row-buttons
    width 100%

.log-wrapper
  height 90%
  overflow scroll
.log-wrapper.filter
  height 85%
  overflow scroll
  @media only screen and (max-height: 667px)
    height: 80% !important

</style>
