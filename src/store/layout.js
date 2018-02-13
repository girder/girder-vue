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
      id: 'users',
      icon: 'account_circle',
      text: 'Users',
      route: '/users'
    }]
  },

  mutations: {
    setTitle (state, title) {
      state.title = title
    },
    setToolbarColor (state, color) {
      state.toolbarColor = color
    }
  }
}
