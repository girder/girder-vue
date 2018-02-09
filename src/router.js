import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout'
import CollectionContainer from '@/containers/CollectionContainer'
import CollectionsContainer from '@/containers/CollectionsContainer'


Vue.use(Router)

const routes = [{
  path: 'collections',
  component: CollectionsContainer
}, {
  path: 'collection/:id',
  component: CollectionContainer
}]

export default new Router({
  routes: [{
      path: '/',
      component: Layout,
      children: routes
  }]
})
