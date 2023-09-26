<script>
/* eslint-disable */
import ReplaceTemplate from '@/components/mixins/ReplaceTemplate'
import LinkToParent from '@/components/mixins/LinkToParent'

var on = {
  click: this.onClick
}

export default {
  name: 'AccordionClick',

  data: () => ({
    active: false,
    parentName: 'AccordionItem'
  }),

  mixins: [
    ReplaceTemplate,
    LinkToParent
  ],

  created () {
    this.on = {
      click: this.onClick
    }
  },

  methods: {
    onClick () {
      this.parent.clicked()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
