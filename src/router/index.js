import Vue from 'vue'
import Router from 'vue-router'
import TranscriptCalculator from '@/components/TranscriptCalculator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TranscriptCalculator',
      component: TranscriptCalculator
    }
  ]
})
