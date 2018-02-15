import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout'
import CollectionRoute from '@/routes/CollectionRoute'
import CollectionsRoute from '@/routes/CollectionsRoute'

Vue.use(Router)

const routes = [{
  component: CollectionsRoute,
  path: 'collections'
}, {
  component: CollectionRoute,
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
