import { ResourceIcons } from '@/constants'

export default {
  namespaced: true,
  state: {
    title: 'Girder',
    toolbarColor: 'blue-grey darken-3',
    navItems: [{
      id: 'home',
      icon: 'home',
      text: 'Home',
      route: '/'
    }, {
      id: 'collections',
      icon: ResourceIcons.COLLECTION,
      text: 'Collections',
      route: '/collections',
    }, {
      id: 'users',
      icon: ResourceIcons.USER,
      text: 'Users',
      route: '/users'
    }, {
      id: 'groups',
      icon: ResourceIcons.GROUP,
      text: 'Groups',
      route: '/groups'
    }, {
      id: 'myData',
      icon: 'folder_shared',
      text: 'My data',
      route: '/user/me',
      requireLogin: true
    }, {
      id: 'admin',
      icon: 'build',
      text: 'Admin console',
      route: '/admin',
      requireAdmin: true
    }]
  },

  mutations: {
    setTitle (state, title) {
      state.title = title
    },
    setToolbarColor (state, color) {
      state.toolbarColor = color
    },
    addNavItem (state, {item}) {
      // TODO support adding before or after a particular id
      state.navItems.push(item)
    }
  }
}
