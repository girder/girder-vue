import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout'
import CollectionContainer from '@/containers/CollectionContainer'
import CollectionsContainer from '@/containers/CollectionsContainer'


Vue.use(Router)

const routes = [{
  component: CollectionsContainer,
  path: 'collections'
}, {
  component: CollectionContainer,
  path: 'collection/:id',
  props: true
}]

export default new Router({
  routes: [{
      path: '/',
      component: Layout,
      children: routes
  }]
})
