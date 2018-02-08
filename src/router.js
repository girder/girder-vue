import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'
import * as pages from '@/components/pages'

Vue.use(Router)

const routes = [{
  path: 'collections',
  component: pages.Collections
}]

export default new Router({
  routes: [{
      path: '/',
      component: Layout,
      children: routes
  }]
})
