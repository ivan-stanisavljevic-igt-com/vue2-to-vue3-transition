<script>
  import ReplaceTemplate from '@/components/mixins/ReplaceTemplate'

  const activeClass = 'active'

  export default {
    name: 'Accordion',

    props: {
      mode: {
        type: String,
        default: 'single'
      }
    },

    data: () => ({
      currentlyActive: null
    }),

    mixins: [
      ReplaceTemplate
    ],

    methods: {
      click (elem) {
        switch (this.mode) {
          case 'single':
            this.singleOperation(elem)
            break

          case 'multi':
            this.multiOperation(elem)
            break

          default:
            this.singleOperation(elem)
        }
      },

      activateItem (item) {
        item.classList.add(activeClass)
      },

      deactivateItem (item) {
        item.classList.remove(activeClass)
      },

      singleOperation (item) {
        if (item === this.currentlyActive) {
          this.deactivateItem(item)
          this.currentlyActive = null
        } else {
          if (this.currentlyActive) {
            this.deactivateItem(this.currentlyActive)
          }
          this.activateItem(item)
          this.currentlyActive = item
        }
      },

      multiOperation (item) {
        if (item.classList.contains(activeClass)) {
          this.deactivateItem(item)
        } else {
          this.activateItem(item)
        }
      }
    },

    mounted () {
    }
  }
</script>

<style lang="stylus" scoped>

</style>
