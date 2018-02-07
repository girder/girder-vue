import rest, { setToken } from '@/rest'

export default {
  namespaced: true,
  state: {
    user: null,
    token: null
  },

  mutations: {
    SET_USER (state, data) {
      state.user = data
    },

    SET_TOKEN (state, data) {
      state.token = data
      setToken(data)
    },

    LOGOUT (state) {
      state.user = null
      state.token = null
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user && !!state.user.admin === true
  },

  actions: {
    whoami ({commit}) {
      rest.get('/user/me').then(({data}) => {
        commit('SET_USER', data)
      })
    },

    login ({commit}) {

    },

    logout ({commit}) {
      rest.delete('/user/authentication').then(() => {
        commit('LOGOUT')
      })
    }
  }
}
