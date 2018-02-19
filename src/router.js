import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/Layout';
import CollectionRoute from '@/routes/CollectionRoute';
import CollectionsRoute from '@/routes/CollectionsRoute';
import FolderRoute from '@/routes/FolderRoute';
import UsersRoute from '@/routes/UsersRoute';

Vue.use(Router);

const layoutRoutes = [{
  component: CollectionsRoute,
  path: 'collections',
}, {
  component: CollectionRoute,
  path: 'collection/:id',
}, {
  component: FolderRoute,
  path: 'folder/:id',
}, {
  component: UsersRoute,
  path: 'users',
}, {
  // Legacy route, might remove in the future
  path: 'collection/:cid/folder/:id',
  redirect: '/folder/:id',
}];

const rootRoutes = [];

export default new Router({
  routes: [{
    path: '/',
    component: Layout,
    children: layoutRoutes,
  },
  ...rootRoutes],
});

export const addRootRoute = (route) => {
  rootRoutes.push(route);
};

export const addLayoutRoute = (route) => {
  layoutRoutes.push(route);
};
