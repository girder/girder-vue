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
      icon: 'storage',
      text: 'Collections',
      route: '/collections',
    }, {
      id: 'users',
      icon: 'person',
      text: 'Users',
      route: '/users'
    }, {
      id: 'groups',
      icon: 'people',
      text: 'Groups',
      route: '/groups'
    }, {
      id: 'myData',
      icon: 'folder_special',
      text: 'My data',
      route: '/user/me',
      requireLogin: true
    }, {
      id: 'admin',
      icon: 'settings',
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
