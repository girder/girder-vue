import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App'
import router from './router'
import store from './store'
import { setApiUrl, getTokenFromCookie } from './rest'

setApiUrl(document.getElementById('girder-api-root').getAttribute('url'))
sync(store, router)

store.commit('auth/setToken', getTokenFromCookie())
store.dispatch('auth/whoami').then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
  })
})
