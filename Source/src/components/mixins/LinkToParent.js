export default {
  data: () => ({
    parent: null,
    parentName: ''
  }),

  mounted () {
    var parent = this.$parent

    while (parent.$options.name !== this.parentName) {
      parent = parent.$parent
      if (!parent) break
    }

    this.parent = parent
  }
}
