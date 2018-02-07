import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App'
import router from './router'
import store from './store'
import { setApiUrl, getTokenFromCookie } from './rest'

setApiUrl(document.getElementById('girder-api-root').getAttribute('url'))
store.commit('auth/SET_TOKEN', getTokenFromCookie())
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

