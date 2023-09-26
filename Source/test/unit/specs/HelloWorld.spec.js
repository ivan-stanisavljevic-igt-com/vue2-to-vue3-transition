import Vue from 'vue'
import HelloWorld from '@/components/test/HelloWorld'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HelloWorld)
    const vm = new Constructor().$mount()

    expect(vm.$el.querySelector('.hallo-world .content').textContent)
      .toMatch('\'Hello world\' text to be displayed on test page through Vuex store modules')
  })
})
