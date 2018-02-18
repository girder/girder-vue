import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/Layout';
import CollectionRoute from '@/routes/CollectionRoute';
import CollectionsRoute from '@/routes/CollectionsRoute';
import FolderRoute from '@/routes/FolderRoute';

Vue.use(Router);

const routes = [{
  component: CollectionsRoute,
  path: 'collections',
}, {
  component: CollectionRoute,
  path: 'collection/:id',
}, {
  component: FolderRoute,
  path: 'folder/:id',
}, {
  // Legacy route, might remove in the future
  path: 'collection/:cid/folder/:id',
  redirect: '/folder/:id',
}];

export default new Router({
  routes: [{
    path: '/',
    component: Layout,
    children: routes,
  }],
});
