import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
import { Collections } from '@/components/pages'

Vue.use(Router)

const routes = [{
  path: 'collections',
  component: Collections
}]

export default new Router({
  routes: [{
      path: '/',
      component: Layout,
      children: routes
  }]
})
