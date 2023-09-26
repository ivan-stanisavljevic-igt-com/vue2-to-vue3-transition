<template>
  <footer class="footer" ref="footerH" :class="{'footerBgr' : stickyBetslip}">
    <!-- BOYD -->
    <template v-if="brandKey === 'boyd'">
      <div class="good_to_be_connected">
        <img :src="mediaServer('/static/brand-img/' + brandKey + '/footer.png')"/>
      </div>
      <div class="footer_nav">
        <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
      </div>
      <section class="footer_contact">
          <p v-html="$t('Footer.contact_line_1')"></p>
          <!-- <p>{{ $t('Footer.contact_line_2') }}</p> -->
      </section>
      <section class="footer-bottom">
        <div class="footer_copyright">
          <span class="copy_text">{{ $t('Footer.copyright', { currentYear: currentYear }) }}</span>
          <v-icon>remove</v-icon>
          <site-navigation :navigation-section="'FOOTER_TERMS'"></site-navigation>
        </div>
        <div class="build_version_text" v-if="buildVersion">{{ buildVersion }}</div>
        <div class="back-to-top" @click="goBack()"><v-icon>expand_less</v-icon></div>
      </section>
    </template>
    <!-- RW -->
    <template v-if="brandKey === 'rw'">
      <div class="footer_logo">
        <img :src="mediaServer('/static/brand-img/rw/logo-circle.svg')" alt="rw"/>
      </div>
      <div class="igt_footer_nav">
        <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
      </div>
      <section class="bottom-info">
          <p>{{ $t('Footer.info.companyName', { currentYear: currentYear }) }}</p>
          <p>{{ $t('Footer.info.gamblingProblem') }}</p>
          <a class="rg" href="https://www.nevadacouncil.org/responsible-gaming/">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg"/>
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <p class="build_version_text" v-if="buildVersion">{{ buildVersion }}</p>
      </section>
      <section class="footer-bottom">
        <section class="back-to-top" @click="goBack()"><v-icon>expand_less</v-icon></section>
      </section>
    </template>
    <!-- DN -->
    <template v-if="(brandKey === 'dn' || brandKey === 'dnw')">
      <div class="footer-holder">
        <div class="footer-content">
          <section class="footer_nav section about">
            <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
          </section>

          <section class="footer_contact section">
            <section class="footer_nav section support">
              <site-navigation :navigation-section="'FOOTER_SUPPORT'"></site-navigation>
            </section>
          </section>

          <section class="footer-address section">
            <div class="logos">
              <span><img :src="mediaServer('/static/brand-img/' + brandKey + '/secondary-logo-white.png')"/></span>
            </div>
            <section class="footer_nav section address">
              <site-navigation :navigation-section="'FOOTER_ADDRESS'"></site-navigation>
            </section>
          </section>

          <section class="footer_social section">
            <section class="footer_nav section social-icons">
              <site-navigation :navigation-section="'FOOTER_SOCIAL_ICONS'"></site-navigation>
            </section>
          </section>

          <!-- <section class="footer-hours section">
            <h3>{{ $t('Footer.working_hours_title') }}</h3>
            <p>{{ $t('Footer.working_hours_line1') }}</p>
            <p>{{ $t('Footer.working_hours_line2') }}</p>
            <p>{{ $t('Footer.working_hours_line3') }}</p>
            <p>{{ $t('Footer.working_hours_line4') }}</p>
          </section> -->
        </div>
      </div>

      <div class="footer_bottom_holder">
        <div class="footer-holder">
          <div class="footer-responsible section">
            <div class="lottery-logo">
              <img :src="mediaServer('/static/brand-img/' + brandKey + '/wv-lottery-logo-black.png')"/>
            </div>
            <span class="responsible_text">{{ $t('Footer.responsible') }}</span>
            <div class="lottery-logo-primary"><img :src="mediaServer('/static/brand-img/' + brandKey + '/delaware-north.png')"/></div>
            <div class="build_version_text" v-if="buildVersion">{{ buildVersion }}</div>
          </div>
          <div class="footer-bottom">
            <div class="back-to-top" @click="goBack()"><v-icon>expand_less</v-icon></div>
          </div>
        </div>
      </div>
    </template>
    <!-- CIRCA -->
    <template v-if="brandKey === 'circa'">
      <div v-if="!mobileBigAndBelow" class="footer_nav">
        <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
      </div>
      <div v-if="mobileBigAndBelow" class="rg-footer">
        <span>{{ $t('Footer.InfoMessageOne') }}</span>
        <span>{{ $t('Footer.InfoMessageTwo') }}</span>
        <div class="logo-holder">
          <a href="https://www.ncpgambling.org/">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/circa/rg-logo.svg')" alt="rg"/>
            <span>{{ $t('Footer.InfoMessageThree') }}</span>
          </a>
        </div>
      </div>
      <section class="footer-bottom">
        <div class="footer_copyright">
          <span class="copy_text">{{ $t('Footer.copyright', { currentYear: currentYear }) }}</span>
          <div class="build_version_text" v-if="buildVersion">{{ buildVersion }}</div>
        </div>
        <div class="back-to-top" @click="goBack()">
          <v-icon>expand_less</v-icon>
          <span class="text">{{ $t('Footer.BackToTop') }}</span>
        </div>
      </section>
    </template>
    <!-- SUPERBOOK & MAVERICK -->
    <template v-if="brandKey === 'sb' || brandKey === 'mav'">
      <div class="footer_logo">
        <img v-if="brandKey === 'sb'" :src="mediaServer('/static/brand-img/sb/logo-footer.png')" alt="sb"/>
        <img v-if="brandKey === 'mav'" :src="mediaServer('/static/brand-img/' + brandKey +'/footer-logo.png')" alt="mav"/>
      </div>
      <div class="footer_social">
        <site-navigation :navigation-section="'FOOTER_SOCIAL_ICONS'"></site-navigation>
      </div>
      <div v-if="brandKey === 'mav' && !mobileBigAndBelow" class="rg-footer">
        <div class="footer_info" v-html="$t('Footer.info')"></div>
      </div>
      <div v-if="!mobileBigAndBelow && brandKey === 'sb'" class="footer_info" v-html="$t('Footer.info.' + state)"></div>
      <div v-if="mobileBigAndBelow" class="rg-footer">
        <template v-if="brandKey === 'sb' && state !== 'VA'">
          <span v-if="brandKey === 'sb'">{{ $t('Footer.InfoMessageOne') }}</span>
          <span v-if="brandKey === 'sb'">{{ $t('Footer.InfoMessageTwo.' + state) }}</span>
          <div v-if="brandKey === 'sb'" class="logo-holder">
            <img v-if="state==='NJ'" @click.stop="go2ResponsibleGaming" class="rg-logo nj" :src="mediaServer('/static/brand-img/' + brandKey +'/rg-logo-nj.svg')" alt="rg"/>
            <img v-else class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey +'/rg-logo.svg')" alt="rg"/>
            <span v-if="state==='CO'"><a href="http://problemgamblingcolorado.org/">{{ $t('Footer.InfoMessageThree') }}</a></span>
            <span v-if="state==='AZ'"><a href="https://problemgambling.az.gov/">{{ $t('Footer.InfoMessageThree') }}</a></span>
            <span v-if="state==='IA'"><a href="https://idph.iowa.gov/igtp">{{ $t('Footer.InfoMessageThree') }}</a></span>
            <span v-if="state==='NJ'" @click.stop="go2ResponsibleGaming">{{ $t('Footer.InfoMessageThree') }}</span>
            <span v-if="state==='TN'"><a href="https://www.tn.gov/behavioral-health/substance-abuse-services/treatment---recovery/treatment---recovery/problem-gambling-programs.html">{{ $t('Footer.InfoMessageThree') }}</a></span>
            <span v-if="state==='VA'"><a href="https://vcpg.net/">{{ $t('Footer.InfoMessageThree') }}</a></span>
          </div>
        </template>
        <template v-if="brandKey === 'sb' && state === 'VA'">
          <span class="m-b-7">{{ $t('Footer.InfoMessages.Superbook.VA.One') }}</span>
          <span class="m-b-7">{{ $t('Footer.InfoMessages.Superbook.VA.Two') }}</span>
          <span class="m-b-7">{{ $t('Footer.InfoMessages.Superbook.VA.Three') }}</span>
          <span class="m-b-7">{{ $t('Footer.InfoMessages.Superbook.VA.Four') }}</span>
          <span class="m-b-7">{{ $t('Footer.InfoMessages.Superbook.VA.Five') }}<a href='https://vcpg.net'>{{ $t('Footer.InfoMessages.Superbook.VA.Link1') }}</a></span>
          <span class="m-b-7"><a href='https://www.valottery.com/playingmatters/voluntaryexclusionprogram'>{{ $t('Footer.InfoMessages.Superbook.VA.Link2') }}</a></span>
        </template>
        <div v-if="brandKey === 'mav'" class="logo-holder">
          <span><a href="https://www.ncpgambling.org/">{{ $t('Footer.InfoMessageThree') }}</a></span>
          <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey +'/rg-logo-white.svg')" alt="rg"/>
          <span>{{ $t('Footer.InfoMessageOne') }}</span>
          <span>{{ $t('Footer.InfoMessageTwo.' + state) }}</span>
        </div>
      </div>
      <div class="igt_footer_nav">
        <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
      </div>
      <section class="footer-bottom">
        <div class="footer_copyright">
          <span v-if="brandKey === 'sb'" class="copy_text">{{ $t('Footer.copyright.' + state, { currentYear: currentYear }) }}</span>
          <span v-if="brandKey === 'mav'" class="copy_text">{{ $t('Footer.copyright', { currentYear: currentYear }) }}</span>
          <div v-if="state === 'NJ' && isLoggedIn" class="current-time">{{ $t('MyAccount.SessionTime.' + state) }} {{sessionTime}}</div>
          <div v-if="state === 'NJ'" class="current-time">{{currentTime}}</div>
          <div class="build_version_text" v-if="buildVersion">{{ buildVersion }}</div>

        </div>
        <div class="back-to-top" @click="goBack()"><v-icon>expand_less</v-icon></div>
      </section>
    </template>
    <!-- QCasino & PR -->
    <template v-if="brandKey === 'qcasino' || brandKey === 'pr'">
      <div class="footer_logo">
        <img :src="mediaServer('/static/brand-img/' + brandKey +'/footer-logo.png')" alt="logo"/>
      </div>
      <div class="footer_social">
        <site-navigation :navigation-section="'FOOTER_SOCIAL_ICONS'"></site-navigation>
      </div>
      <div v-if="mobileBigAndBelow" class="rg-footer">
        <span>{{ $t('Footer.InfoMessageOne') }}</span>
        <span>{{ $t('Footer.InfoMessageTwo.' + state) }}</span>
        <div v-if="brandKey === 'qcasino'" class="logo-holder">
          <a href="https://yourlifeiowa.org/gambling"><img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey +'/rg-logo.svg')" alt="rg"/></a>
          <span><a href="https://yourlifeiowa.org/gambling">{{ $t('Footer.InfoMessageThree') }}</a></span>
        </div>
        <div v-if="brandKey === 'pr'" class="logo-holder">
          <a href="https://msgaming.org/responsible-gaming/"><img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey +'/rg-logo.svg')" alt="rg"/></a>
          <span><a href="https://msgaming.org/responsible-gaming/">{{ $t('Footer.InfoMessageThree') }}</a></span>
        </div>
      </div>
      <div class="igt_footer_nav">
        <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
      </div>
      <section class="footer-bottom">
        <div class="footer_copyright">
          <span class="copy_text">{{ $t('Footer.copyright', { currentYear: currentYear }) }}</span>
        </div>
        <div class="back-to-top" @click="goBack()"><v-icon>expand_less</v-icon></div>
      </section>
    </template>
    <!-- GENERIC template-->
    <template v-if="brandLayout === 'generic' && brandKey !== 'generic-rilot'">
      <div class="footer_social">
        <site-navigation :navigation-section="'FOOTER_SOCIAL_ICONS'"></site-navigation>
      </div>
      <div class="igt_footer_nav">
        <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
      </div>
      <section class="bottom-info">
          <p>{{ $t('Footer.info.companyName', { currentYear: currentYear }) }}</p>
          <p>{{ $t('Footer.info.gamblingProblem') }}</p>
          <a class="rg" :target="isMobileApp ? '_self':'_blank'" :href="rgLink"><!--Url depend on STATE-->
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg"/>
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <p class="build_version_text" v-if="buildVersion">{{ buildVersion }}</p>
      </section>
      <section class="footer-bottom">
        <section class="back-to-top" @click="goBack()"><v-icon>expand_less</v-icon></section>
      </section>
    </template>
    <!-- GENERIC template END-->

    <!-- RILOT-->
    <template v-if="brandKey === 'generic-rilot'">
      <div class="footer-top footercontent">
        <div class="footer-top-left">
          <section class="company-pr">
            <div class="title">{{ $t('Footer.playResponsiblyTitle') }}</div>
            <div class="desc">{{ $t('Footer.playResponsiblyDesc') }}</div>
            <div class="link">
              <img :src="mediaServer('/static/brand-img/generic-rilot/footer/gamble-banner.png')">
              <router-link :to="{ name: 'info', params: { infopagename : 'responsible-gaming' }}">{{ $t('Footer.FindOutMore') }}</router-link>
            </div>
          </section>
        </div>
        <div class="footer-top-right">
          <section class="social_and_contact">
            <section class="contact_us">
              <router-link :to="{ name: 'info', params: { infopagename : 'contact' }}">{{ $t('Footer.ContactUs') }}</router-link>
            </section>
          </section>
          <section class="partners">
            <site-navigation :navigation-section="'PARTNERS'"></site-navigation>
          </section>
        </div>
      </div>
      <section class="ri-ocean-state">
        <section class="footercontent">
          <div class="col-left"><img :src="mediaServer('/static/brand-img/generic-rilot/footer/ri-badge.jpg')"></div>
          <div class="col-right">{{ $t('Footer.oceanState') }}</div>
        </section>
        <section class="footer-bottom">
          <div class="bottom-info">
            <div v-if="!isMobileApp" class="app-links">
              <site-navigation :navigation-section="'LINK_TO_APPS'"></site-navigation>
            </div>
          </div>
        </section>
      </section>
      <div class="igt_footer_nav">
        <site-navigation :navigation-section="'FOOTER_ABOUT'"></site-navigation>
      </div>
      <section class="footer-bottom">
        <div class="bottom-info">
          <p>{{ $t('Footer.info.companyName', { currentYear: currentYear }) }}</p>
          <p class="build_version_text" v-if="buildVersion">{{ buildVersion }}</p>
        </div>
        <section class="back-to-top" @click="goBack()"><v-icon>expand_less</v-icon></section>
      </section>
    </template>
  </footer>
</template>

<script>
  import config from '@/config'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import Branding from '@/components/mixins/Branding'
  import Screen from '@/components/mixins/Screen'
  import Url from '@/components/mixins/Url'
  import router from '@/router'

  import store from '@/store'

  export default {
    name: 'FooterPart',

    mixins: [
      Branding,
      Url,
      Screen
    ],

    components: {
      SiteNavigation
    },

    data () {
      return {
        currentTime: null,
        sessionTime: 0
      }
    },

    computed: {
      config () {
        return config
      },
      state () {
        return config.app.autoconf.STATE
      },
      buildVersion () {
        return window.ctsautoconf && window.ctsautoconf.BUILD_VERSION && window.ctsautoconf.BUILD_VERSION !== 'BUILD_VERSION' ? window.ctsautoconf.BUILD_VERSION : undefined
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      currentYear () {
        let year = (new Date()).getFullYear()
        return year
      },
      rgLink () {
        if (this.state === 'AZ') {
          return 'https://problemgambling.az.gov/'
        } else if (this.state === 'WA') {
          return 'https://www.evergreencpg.org/'
        } else if (this.state === 'WI') {
          return 'https://www.ncpgambling.org/state/wisconsin/'
        } else if (this.state === 'CO') {
          return 'http://problemgamblingcolorado.org/'
        } else if (this.state === 'NV') {
          return 'https://www.nevadacouncil.org/responsible-gaming/'
        } else if (this.state === 'TN') {
          return 'https://www.tn.gov/behavioral-health/substance-abuse-services/treatment---recovery/treatment---recovery/problem-gambling-programs.html'
        } else if (this.state === 'PR') {
          return 'https://www.ncpgambling.org/'
        } else if (this.state === 'NJ') {
          return 'https://www.ncpgambling.org/state/new-jersey/'
        } else if (this.state === 'MS') {
          return 'http://www.msgambler.org/'
        } else if (this.state === 'LA') {
          return 'https://www.ncpgambling.org/'
        } else if (this.state === 'IL') {
          return 'https://www.ncpgambling.org/state/illinois/'
        } else if (this.state === 'RI') {
          return 'https://www.ncpgambling.org/state/rhode-island/'
        } else if (this.state === 'VA') {
          return 'https://www.ncpgambling.org/state/virginia/'
        } else {
          return 'https://www.ncpgambling.org/'
        }
      },
      isMobileApp () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      stickyBetslip () {
        return window.ctsautoconf.STICKY_BETSLIP || false
      }
    },

    methods: {
      updateCurrentTime () {
        this.currentTime = (new Date()).toLocaleString('en-US', {timeZone: config.app.timeZone})
      },
      footerHeight () {
        if (this.$refs.footerH) {
          store.commit('screenState/setFooterHeight', this.$refs.footerH.clientHeight)
        }
      },
      goBack () {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 200)
      },
      go2ResponsibleGaming () {
        if (router.currentRoute.path !== '/info/responsible-gaming') {
          router.push({ path: '/info/responsible-gaming' })
        } else return false
      }
    },
    created () {
      this.currentTime = (new Date()).toLocaleString('en-US', {timeZone: config.app.timeZone})
      setInterval(() => this.updateCurrentTime(), 1 * 1000)
      setInterval(() => {
        let value = Math.round(Math.abs(localStorage.loginTime - Date.now()) / 1000)
        if (value >= 0) {
          let minutes = Math.floor(value / 60)
          let seconds = value - minutes * 60
          seconds = (seconds < 10 ? ('0' + seconds) : seconds)
          minutes = (minutes < 10 ? ('0' + minutes) : minutes)
          this.sessionTime = `${minutes}:${seconds}`
        }
      }, 1000)
      /* window.addEventListener('load', () => {
        this.footerHeight()
      }) */
    },
    mounted () {
      setTimeout(() => {
        this.footerHeight()
      }, 1000)
    },
    updated () {
      this.footerHeight()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .igt_footer_nav
    >>>.site-navigation
      .navigation
        text-align center
        .navigation-item
          display: inline !important
          padding: 0 10px
  .rg-footer
    .m-b-7
      margin-bottom: 7px
</style>
