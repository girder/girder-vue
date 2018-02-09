import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/views/Layout'
import * as containers from '@/components/containers'

Vue.use(Router)

const routes = [{
  path: 'collections',
  component: containers.CollectionsContainer
}, {
  path: 'collection/:id',
  component: containers.CollectionContainer
}]

export default new Router({
  routes: [{
      path: '/',
      component: Layout,
      children: routes
  }]
})
