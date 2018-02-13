import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App'
import router from './router'
import store from './store'
import { setApiUrl, getTokenFromCookie, onError } from './rest'
import './utils/ui-setup'

sync(store, router)
setApiUrl(document.getElementById('girder-api-root').getAttribute('url'))
onError((error) => {
  if (401 === error.response.status && !store.getters.isLoggedIn) {
    store.dispatch('toast/showToast', {
      text: 'You must log in first.',
      type: 'info'
    })
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
