import { ResourceIcons } from '@/constants';

export const theme = {
  title: 'Girder',
  toolbarColor: 'blue-grey darken-3',
};

export const navItems = [{
  id: 'home',
  icon: 'home',
  text: 'Home',
  route: '/',
}, {
  id: 'collections',
  icon: ResourceIcons.COLLECTION,
  text: 'Collections',
  route: '/collections',
}, {
  id: 'users',
  icon: ResourceIcons.USER,
  text: 'Users',
  route: '/users',
}, {
  id: 'groups',
  icon: ResourceIcons.GROUP,
  text: 'Groups',
  route: '/groups',
}, {
  id: 'myData',
  icon: 'folder_shared',
  text: 'My data',
  route: '/user/me',
  requireLogin: true,
}, {
  id: 'admin',
  icon: 'build',
  text: 'Admin console',
  route: '/admin',
  requireAdmin: true,
}];
