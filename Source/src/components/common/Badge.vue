<!--
  Example
  <badge :text="'88'"></badge>
 -->

<template>
  <div class="badge">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'Badge',

    props: {
      text: {
        type: String,
        default: ''
      }
    },

    data: () => ({

    }),

    methods: {

    },

    created () {

    }

  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"

  .badge
    font-weight: bold
    padding: 0 4px
    border-radius: 50%
    background: #ff671f
    color: #fff
    text-align: center
    display: inline-block
    min-width: 1.67em
    min-height: 1.67em
    display: inline-flex;
    align-items: center;
    justify-content: center

  .badgeIconLive
    background: #e7212d
  .browser-internet-explorer
    .badge
      span
        margin-top: 1px
        margin-left: -1px
        line-height 16px

</style>
