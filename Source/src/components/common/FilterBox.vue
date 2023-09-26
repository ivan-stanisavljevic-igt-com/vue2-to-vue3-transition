<template>
  <form class="filter-box" action="">
    <div class="wrapper">
      <v-icon>search</v-icon>
      <input
        v-model="search"
        :class="[className, {'empty': search === 'Search ...'}]"
        :placeholder="search ? '' : 'Search ...'"
        @focus="focus()"
        @blur="blur()"
        name="filter-box"
        type="text"
        autocomplete="off">
        <v-btn class="cancel" @click="cancel()">Cancel</v-btn>
    </div>
  </form>
</template>

<script>
  export default {
    name: 'FilterBox',

    props: {
      text: {
        type: String,
        default: 'Search ...'
      }
    },

    data: () => ({
      search: '',
      className: ''
    }),

    methods: {
      cancel () {
        this.search = ''
      },

      focus () {
        if (this.search === '') {
          this.search = ''
        }
        this.className = 'focus'
      },

      blur () {
        if (this.search === '') {
          this.search = 'Search ...'
        }

        this.className = ''
      }
    },

    created () {

    }

  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"

  .filter-box
    .wrapper
      display: flex
      padding: 5px 10px
      border: solid 10px #F0F1F5
      max-width: 300px

      .icon
        display: flex

      .cancel
        background: none
        border: none
        box-shadow: none


    input
      width: 100%
      outline: none
      margin-left: gap
</style>
