import Screen from '@/components/mixins/Screen'
import lib from '@/library'
export default {
  data () {
    return {
      eventAttached: false,
      mounted: false,
      loadedComponent: [],
      lastExpandedPanel: undefined,
      expandedPanel: []
    }
  },
  mixins: [Screen],
  computed: {},

  methods: {
    /* attach event listener to parent container and listen for expansion panel header clicks */
    attachEvent (element) {
      let container = document.getElementById(element)
      var self = this
      if (container) {
        container.addEventListener('click', function (event) {
          let target = event.target
          let mainArrow = event.target.parentElement
          let arrowParent = event.target.parentElement.parentElement.parentElement
          let arrow = mainArrow.classList.contains('v-expansion-panel__header__icon')
          let parentElem
          if (arrow) {
            parentElem = arrowParent
          } else {
            parentElem = target.parentElement
          }
          let parentElemId = parentElem.getAttribute('data-id') ? parentElem.id : parentElem.getAttribute('data-header')
          if (parentElemId) {
            let panelActive = document.getElementById(parentElemId).classList.contains('v-expansion-panel__container--active')
            let panelComponent = parentElem.getAttribute('data-id') ? parentElem.getAttribute('data-id') : parentElem.getAttribute('data-component')
            if (panelActive) {
              self.expandPanel(parentElemId)
              self.lastExpandedPanel = parentElemId
              if (self.loadedComponent.includes(parentElemId)) {
                self.refreshComponent(panelComponent)
              }
              if (!self.loadedComponent.includes(parentElemId)) self.loadedComponent.push(parentElemId) // rendered component list
              if (!self.expandedPanel.includes(parentElemId)) self.expandedPanel.push(parentElemId) // current expanded panel
            } else {
              if (self.expandedPanel.includes(parentElemId)) self.expandedPanel.splice(self.expandedPanel.indexOf(parentElemId), 1)
            }
          }
        })
        this.eventAttached = true
      }
    },
    /* re-render component and get fresh data; component will re-render if we change initial key (componentKeys)  */
    refreshComponent (component) {
      this.componentKeys[component] += 1
    },
    /* in case of mobile: find previous sibling and jump to element; in case of desktop: scroll to top 0 */
    jumpToElement (id) {
      let userAgent = lib.core.userAgent.os.name
      let scrollPosition = window.scrollY
      var panel = document.getElementById(id + '-panel')
      if (panel && scrollPosition > 0) {
        if (panel.previousSibling) {
          // find previous sibling and jump to element
          let previousPanelId = panel.previousSibling.id
          if (this.mobileBigAndBelow) {
            if (userAgent === 'ios') window.location.hash = '#' + previousPanelId
            location.href = '#' + previousPanelId
          }
          if (!this.mobileBigAndBelow) {
            window.scrollTo(0, 0)
          }
          if (location.hash) this.replaceQueryOrHash('hash')
        }
      } else if (this.mobileBigAndBelow && panel && panel.previousSibling) {
        let previousPanelId = panel.previousSibling.id
        if (userAgent === 'ios') window.location.hash = '#' + previousPanelId
        location.href = '#' + previousPanelId
        if (location.hash) this.replaceQueryOrHash('hash')
      }
    },
    expandPanel (id, autoExpand = false) {
      this.expandedPanel = [] // first close all
      if (autoExpand) {
        if (!this.loadedComponent.includes(id)) this.loadedComponent.push(id) // list of components loaded throught lazy loading (init loading)
        if (!this.expandedPanel.includes(id)) this.expandedPanel.push(id) // current expanded panel
      }
      setTimeout(() => {
        this.jumpToElement(id)
      }, 300)
    },
    replaceQueryOrHash (param) {
      let userAgent = lib.core.userAgent.os.name
      if (param === 'query' && userAgent !== 'ios') this.$router.replace({'query': null}).catch()
      if (param === 'hash' && userAgent !== 'ios') this.$router.replace({'hash': ''}).catch()
    }
  },
  beforeDestroy () {
    this.eventAttached = false
    this.mounted = false
    this.loadedComponent = []
    this.lastExpandedPanel = undefined
    this.expandedPanel = []
  },
  watch: {
    '$route' (to, from) {
      let param = Object.keys(to.query)[0]
      if (param && !this.mounted) {
        this.expandPanel(param, true)
        this.replaceQueryOrHash('query')
      }
    },
    eventAttached (newVal) {
      if (newVal && this.mounted) {
        if (this.$route.query && Object.keys(this.$route.query).length > 0) {
          let param = Object.keys(this.$route.query)[0]
          this.expandPanel(param, true)
          this.replaceQueryOrHash('query')
        }
      }
    }
  }
}
