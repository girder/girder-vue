import rest, { setToken } from '@/rest'

export default {
  namespaced: true,
  state: {
    user: null,
    token: null
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => !!state.user && !!state.user.admin
  },

  mutations: {
    setUser (state, data) {
      state.user = data
    },

    setToken (state, data) {
      state.token = data
      setToken(data)
    }
  },

  actions: {
    whoami ({commit}) {
      return rest.get('/user/me').then((resp) => {
        commit('setUser', resp.data)
        return resp
      })
    },

    login ({commit}, {username, password}) {
      return rest.get('/user/authentication', {
        headers: {
          'Girder-Authorization': 'Basic ' + window.btoa(`${username}:${password}`)
        },
        withCredentials: true
      }).then((resp) => {
        commit('setUser', resp.data.user)
        commit('setToken', resp.data.authToken.token)
        return resp
      })
    },

    logout ({commit}) {
      return rest.delete('/user/authentication').then(() => {
        commit('setUser', null)
        commit('setToken', null)
      })
    }
  }
}
