import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'
import { Collections } from '@/components/pages'

Vue.use(Router)

const routes = [{
  path: 'collections',
  name: 'collections',
  component: Collections
}]

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Layout,
      children: routes
  }]
})
