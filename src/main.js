import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import App from './App';
import { API_ROOT } from './constants';
import router from './router';
import store from './store';
import { setApiUrl, getTokenFromCookie, onResponse } from './rest';
import './utils/ui-setup';

sync(store, router);
setApiUrl(API_ROOT);
onResponse((resp) => {
  if (resp.response && resp.response.status === 401 && !store.getters['auth/isLoggedIn'] &&
      !store.state.auth.authDialogVisible) {
    store.commit('auth/showAuthDialog', {});
    store.dispatch('toast/showToast', {
      text: 'You must log in first.',
      icon: 'info_circled',
    });
  }

  // TODO Handle 500 errors (show a toast perhaps)
  return Promise.reject(resp);
});

store.commit('auth/setToken', getTokenFromCookie());
store.dispatch('auth/whoami').then(() => new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
}));
