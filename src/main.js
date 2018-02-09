import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App'
import router from './router'
import store from './store'
import { setApiUrl, getTokenFromCookie, onError } from './rest'

sync(store, router)
setApiUrl(document.getElementById('girder-api-root').getAttribute('url'))
onError((error) => {
  if (401 === error.response.status && !store.getters.isLoggedIn) {
    // TODO dispatch something that will show a toast message "you must log in first"
    store.commit('dialog/showDialog', 'login')
  }
  return Promise.reject(error)
})

store.commit('auth/setToken', getTokenFromCookie())
store.dispatch('auth/whoami').then(() => new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
}))
