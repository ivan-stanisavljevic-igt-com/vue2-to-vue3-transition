<template>
  <div class="sports-page">
    <v-layout  class="page-layout">
      <v-flex class="main-column" :style="{paddingTop: headerHeight + 'px'}" ref="maincolumn">
        <div class="trnpagewrap">
          <h1>Translator toolbox</h1>
          Translations state:<br />
          language = <b>{{lang}}</b> &nbsp; &nbsp; brand = <b>{{brand}}</b> &nbsp; &nbsp; <a :href="brandDictionaryUrl" target="_blank">brand dict file</a><br />
          <hr />
          <div v-if="isLoadingData">
            <loader></loader>
            <br />
            Loading translation dictionaries and calculating stats
          </div>
          <div v-else-if="dictBase !== null">   
            <button :class="{ 'v-btn v-btn--has-bg theme--light v-size--default': true, 'primary': activeTab == 'stats' }" @click="switchTab('stats')"><span class="v-btn__content">Show Statistics</span></button>
            <button :class="{ 'v-btn v-btn--has-bg theme--light v-size--default': true, 'primary': activeTab == 'dictdiff-merged' }" @click="compareDicts('merged')"><span class="v-btn__content">All (base + new + changed) phrases</span></button>
            <button :class="{ 'v-btn v-btn--has-bg theme--light v-size--default': true, 'primary': activeTab == 'dictdiff-new' }" @click="compareDicts('new')"><span class="v-btn__content">New phrases</span></button>
            <button :class="{ 'v-btn v-btn--has-bg theme--light v-size--default': true, 'primary': activeTab == 'dictdiff-changed' }" @click="compareDicts('changed')">Changed phrases</button>
            <button :class="{ 'v-btn v-btn--has-bg theme--light v-size--default': true, 'primary': activeTab == 'dictdiff-all' }" @click="compareDicts('all')">New + Changed phrases</button>
            <hr />

            <div v-if="activeTab == 'stats'">
              Dictionary stats:<br />
              base dictionary: {{dictStats.basePhraseCount}}<br />
              override dictionary (static translations file): {{dictStats.ovrdPhraseCount}}<br />            
              new phrases (exist only in static's file): {{dictStats.ovrdPhraseNewCount}}<br />
              chaged phrases (same key, different text in static's file): {{dictStats.ovrdPhraseChangedCount}}<br />
              overriden phrases (new or changed phrases from static's file): {{dictStats.ovrdPhraseNewCount}} + {{dictStats.ovrdPhraseChangedCount}} = {{dictStats.ovrdPhraseOverrideCount}}<br />
              duplicate phrases (same phrases in both base and static's file): {{dictStats.ovrdPhraseDuplicateCount}}<br /><br /><br />
              <div class="tdiagram">
                <div class="dstep">
                  <div class="ddata">
                    <div class="dtitle">Base translations</div>
                    <span class="dnums">{{dictStats.basePhraseCount}}</span>
                  </div>
                  <div class="ddata">
                    <div class="dtitle">Brand translations</div>
                    <span class="dnums">{{dictStats.ovrdPhraseCount}}</span>
                  </div>
                </div>
                <div class="sum-down"></div>
                <div class="dstep">
                  <div class="dnote with-arrow-down">
                  Base and Brand translations are mixed at app/website start
                  </div>
                </div>
                <div class="dstep">
                  <div class="ddata">
                    <div class="dtitle">Active translations</div>
                    <span class="dnums">{{dictStats.basePhraseCount + dictStats.ovrdPhraseNewCount}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="activeTab == 'dictdiff-merged' || activeTab == 'dictdiff-new' || activeTab == 'dictdiff-changed' || activeTab == 'dictdiff-all'">
              <div class="dict-to-text">
                {
                  <div v-for="(phraseText, phraseKey, phraseIx) in dictDiff" :key="phraseKey">"{{phraseKey}}": "{{phraseText.replaceAll('"', '\\"')}}"<template v-if="phraseIx < Object.keys(dictDiff).length -1">,</template></div>
                }
              </div>
            </div>         
          </div>         
          <div v-else>
            <button class="v-btn v-btn--has-bg theme--light v-size--default" @click="loadDictionaries()">load diciotnaries & shows stats</button>
            <br />
            Load translation dictionaries and see stats and diffs.<br />
            Once loaded use "Show New + Changed" to create overriding dicitonary for lang + brand.
          </div>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
  import config from '@/config'
  import store from '@/store'
  import axios from 'axios'
  import Loader from '@/components/common/Loader'
  import Screen from '@/components/mixins/Screen'
  import Translator from '@/components/mixins/Translator'

  import HeaderPart from '@/components/layout/parts/HeaderPart'
  import SiteNavigation from '@/components/common/SiteNavigation'

  export default {
    name: 'ToolboxTranslatorPage',

    mixins: [
      Screen,
      Translator
    ],

    components: {
      HeaderPart,
      SiteNavigation,
      Loader
    },

    data () {
      return {
        isLoadingData: false,
        activeTab: '',
        dictBase: null,
        dictOverrides: {},
        dictDiff: {},
        dictStats: { basePhraseCount: 0, ovrdPhraseCount: 0, ovrdPhraseNewCount: 0, ovrdPhraseChangedCount: 0, ovrdPhraseOverrideCount: 0, ovrdPhraseDuplicateCount: 0 }
      }
    },

    computed: {
      headerHeight () { return store.getters['screenState/getHeaderHeight'] },
      // diffMode () { return this.diffMode },
      lang () { return config.app.language },
      brand () { return config.app.BRAND },
      brandDictionaryUrl () { return Translator.methods.trnMakeBrandDictionaryUrl(this.lang, this.brand) }
    },

    methods: {
      mainColumnResize () {
        var mainColumn = this.$refs.maincolumn
        if (mainColumn) {
          store.commit('screenState/setMainColumnWidth', mainColumn.offsetWidth)
        }
      },
      loadDictionaries () {
        this.isLoadingData = true
        this.dictBase = this.trnFindBaseDictionary(this.lang)
        let trnUrl = this.brandDictionaryUrl + '?v=' + new Date().getTime()
        let that = this
        return axios.get(trnUrl).then(response => {
          that.isLoadingData = false
          let dictObj = response.data || {}
          this.dictOverrides = dictObj
          // loadedLanguages.push(lang)
          // console.log('Translator.trnExtractOverrides', Translator.methods.trnExtractOverrides(Translator.methods.translatorBaseDictionaryEn(), msgs, 'all')) // uncomment to extra differences
          // let msgs2 = Translator.methods.trnMakeDictionary(lang, msgs)

          that.dictStats.basePhraseCount = Object.keys(that.dictBase).length
          that.dictStats.ovrdPhraseCount = Object.keys(that.dictOverrides).length
          that.dictStats.ovrdPhraseNewCount = Object.keys(that.trnExtractOverrides(that.dictBase, that.dictOverrides, 'new')).length
          that.dictStats.ovrdPhraseChangedCount = Object.keys(that.trnExtractOverrides(that.dictBase, that.dictOverrides, 'changed')).length
          that.dictStats.ovrdPhraseOverrideCount = Object.keys(that.trnExtractOverrides(that.dictBase, that.dictOverrides, 'all')).length
          that.dictStats.ovrdPhraseDuplicateCount = Object.keys(that.trnExtractOverrides(that.dictBase, that.dictOverrides, 'same')).length

          that.switchTab('stats')
        }).catch(() => {
          that.dictOverrides = {}
          that.dictStats.basePhraseCount = 0
          that.dictStats.ovrdPhraseCount = 0
          that.dictStats.ovrdPhraseNewCount = 0
          that.dictStats.ovrdPhraseChangedCount = 0
          that.dictStats.ovrdPhraseOverrideCount = 0
          that.dictStats.ovrdPhraseDuplicateCount = 0
          that.isLoadingData = false
        })
      },
      switchTab (tab) {
        switch (tab) {
          case 'stats':
          case 'dictdiff-merged':
          case 'dictdiff-new':
          case 'dictdiff-changed':
          case 'dictdiff-all':
            this.activeTab = tab
            break
        }
      },
      compareDicts (diffType) {
        switch (diffType) {
          case 'new':
            this.dictDiff = this.trnExtractOverrides(this.dictBase, this.dictOverrides, 'new')
            this.switchTab('dictdiff-new')
            break
          case 'changed':
            this.dictDiff = this.trnExtractOverrides(this.dictBase, this.dictOverrides, 'changed')
            this.switchTab('dictdiff-changed')
            break
          case 'all':
            this.dictDiff = this.trnExtractOverrides(this.dictBase, this.dictOverrides, 'all')
            this.switchTab('dictdiff-all')
            break
          case 'merged':
            this.dictDiff = this.trnMakeDictionary(this.lang, this.dictOverrides)
            this.switchTab('dictdiff-merged')
            break
        }
      }
    },

    mounted () {
      this.mainColumnResize()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.loadDictionaries()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.trnpagewrap {  text-align: center; padding: 20px 10px; background-color:#efefef; }
.trnpagewrap .spinner { margin-right: auto; margin-left: auto; }
.trnpagewrap .dict-to-text { padding:10px; text-align: left; background-color:#fff; border: solid 1px #999; }
.tdiagram { text-align: center; }
.tdiagram .dtitle { margin: 0 auto 5px; font-weight:bold; }
.tdiagram .dstep { display:block; clear:both; padding: 10px; }
.tdiagram .dnote,
.tdiagram .ddata { padding:6px 12px; margin:5px auto; min-width:150px; box-sizing:border-box; }
.tdiagram .dnote { }
.tdiagram .ddata { display: inline-block; background-color:#fff; border: solid 1px #999; border-radius: 5px; }
.tdiagram .ddata + .ddata { margin-left: 20px; }
.tdiagram .dnums { font-weight:bold; font-size:large; }
.tdiagram .sum-down { position:relative; padding:25px; display:block;  }
.tdiagram .sum-down:after { solid 1px #c00; content:"{"; font-size:200px; font-weight:400; width:200px; height:200px; transform: rotate(270deg); position:absolute; top:-75px; left:50%; margin-left:-175px;}
.tdiagram .with-arrow-down { position:relative; }
.tdiagram .with-arrow-down:after { content:""; position:absolute; bottom:-24px; left:50%; border: solid 10px #333; border-right-color:transparent; border-bottom-color:transparent; border-left-color:transparent; margin-left:-10px; }
</style>
