export default {
  render: function (createElement) {
    return createElement(
      this.$vnode.data.tag,
      {
        on: this.on || null,
        class: this.$vnode.data.staticClass ? '' : this.$vnode.componentOptions.tag
      },
      this.$slots.default
    )
  }
}
