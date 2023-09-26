<template>
  <div v-if="numberOfContests > 0" :class="['contests', stage]">
    <h1 class="contests-title">{{ stage }} {{ $t('Contests.Carusel.Title') }} {{ numberOfContests }}</h1>
    <div class="contests-carousel--container">
      <div class="contests-carousel--slider hide-left-arrow" :class="{'hide-right-arrow': numberOfContests < 4}" ref="contests-carousel-slider">
        <div class="contests-carousel--slider-controls">
          <span class="button left" @click.stop="carouselScroll('left')"><v-icon>arrow_back_ios</v-icon></span>
          <span class="button right" @click.stop="carouselScroll('right')"><v-icon>arrow_forward_ios</v-icon></span>
        </div>
        <div class="contests-carousel--items" ref="contests-carousel-items">
          <template v-if="isLoggedIn">
            <contests-carousel-item ref="contests-carousel-item" v-for="contest in contestsByStage" :key="contest.id" :contestObj="contest" :stage="stage" style="margin-right:8px;" class="contest-item" />
          </template>
          <template v-else>
            <contests-carousel-item ref="contests-carousel-item" v-for="contest in contests4All" :key="contest.id" :contestObj="contest" :stage="stage"  style="margin-right:8px;" class="contest-item" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContestsCarouselItem from '@/components/sports/contests/contestsCarouselItem'

export default {
  name: 'contestsCarousel',
  components: {
    ContestsCarouselItem
  },
  props: {
    stage: {
      validator: function (value) {
        return ['upcoming', 'entered', 'completed'].includes(value)
      }
    },
    isLoggedIn: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters('contests', [
      'getContestsByStage',
      'getContests4All'
    ]),
    contestsByStage () {
      return this.getContestsByStage(this.stage)
    },
    contests4All () {
      return this.getContests4All
    },
    numberOfContests () {
      if (this.isLoggedIn) {
        return this.contestsByStage.length
      } else {
        return this.contests4All.length
      }
    }
  },
  methods: {
    carouselScroll (direction) {
      const carousledSliderContainer = this.$refs['contests-carousel-slider']
      const carouselItemsScroll = this.$refs['contests-carousel-items']
      const item = this.$refs['contests-carousel-item']
      const itemMarginRight = parseInt(item[0].$el.style.marginRight.substring(0, item[0].$el.style.marginRight.indexOf('px')))
      const itemWidth = item[0] ? item[0].$el.clientWidth + itemMarginRight : 0
      const carouselItemsScrollStyle = carouselItemsScroll.style
      const carouselItemsScrollPosition = carouselItemsScroll.style.left ? parseInt(carouselItemsScroll.style.left) : 0

      const contestSliderScrollWidth = carousledSliderContainer.scrollWidth - carouselItemsScrollPosition - carousledSliderContainer.clientWidth

      switch (direction) {
        case 'right':
          if (carouselItemsScrollPosition - itemWidth >= -contestSliderScrollWidth) {
            carouselItemsScrollStyle.left = (carouselItemsScrollPosition - itemWidth) + 'px'
          } else {
            carouselItemsScrollStyle.left = -contestSliderScrollWidth + 'px'
            carousledSliderContainer.classList.add('hide-right-arrow')
          }
          carousledSliderContainer.classList.remove('hide-left-arrow')
          break
        case 'left':
          if (carouselItemsScrollPosition + itemWidth <= 0) {
            carouselItemsScrollStyle.left = (carouselItemsScrollPosition + itemWidth) + 'px'
          } else {
            carouselItemsScrollStyle.left = '0'
            carousledSliderContainer.classList.add('hide-left-arrow')
          }
          carousledSliderContainer.classList.remove('hide-right-arrow')
          break
        default:
          break
      }

      if (carouselItemsScrollPosition - itemWidth >= -contestSliderScrollWidth) {
        carousledSliderContainer.classList.remove('hide-right-arrow')
      }

      if (carouselItemsScrollPosition + itemWidth <= 0) {
        carousledSliderContainer.classList.remove('hide-left-arrow')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.contests
  padding 10px 0 0
  &.upcoming
    .contests-title
      color: #3ca77c
  &.entered
    .contests-title
      color: #4198b3
  &.completed
    padding-bottom: 30px
    .contests-title
      color: #858585
  .contests-title
    text-transform: uppercase
    font-style: italic
    font-size 22px
    margin 0
    margin-left: 30px
    margin-bottom 2px
    @media mobile-big-and-below
      margin-left 10px
  .contests-carousel--container
    position relative
    padding: 0 30px
    @media mobile-big-and-below
      padding 0 10px
    .contests-carousel--slider.hide-right-arrow
      .contests-carousel--slider-controls
        .right
          display none
    .contests-carousel--slider.hide-left-arrow
      .contests-carousel--slider-controls
        .left
          display none
    .contests-carousel--slider
      width: 100%
      overflow hidden
      @media tablet
        overflow-x: scroll
        padding 10px 0 15px
      @media mobile-big-and-below
        overflow-x: scroll
        padding 0 0 15px
      .contests-carousel--slider-controls
        .left, .right
          position absolute
          top 50%
          transform translateY(-50%)
          cursor pointer
          @media mobile-big-and-below
            display: none
          i
            font-size 30px
        .left
          left 0
        .right
          right 0
      .contests-carousel--items
        position relative
        display flex
        left 0
        transition: left .5s
</style>
