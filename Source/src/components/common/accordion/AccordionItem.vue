<script>

import ReplaceTemplate from '@/components/mixins/ReplaceTemplate'
import LinkToParent from '@/components/mixins/LinkToParent'

export default {
  name: 'AccordionItem',

  data: () => ({
    active: false,
    parentName: 'Accordion'
  }),

  mixins: [
    ReplaceTemplate,
    LinkToParent
  ],

  created () {

  },

  methods: {
    clicked () {
      if (this.parent) {
        this.parent.click(this.$el)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
