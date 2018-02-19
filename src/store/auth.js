import rest, { formEncode, setToken } from '@/rest';

export const authDialogModes = {
  LOGIN: 'login',
  REGISTER: 'register',
  PASSWORD_RESET: 'password_reset',
};

export default {
  namespaced: true,
  state: {
    authDialogMode: authDialogModes.LOGIN,
    authDialogVisible: false,
    user: null,
    token: null,
  },

  getters: {
    isLoggedIn: state => !!state.user,
    isAdmin: state => !!state.user && !!state.user.admin,
  },

  mutations: {
    setUser(state, data) {
      state.user = data;
    },

    setToken(state, data) {
      state.token = data;
      setToken(data);
    },

    setAuthDialogMode(state, mode) {
      state.authDialogMode = mode;
    },

    setAuthDialogVisible(state, val) {
      state.authDialogVisible = val;
    },

    showAuthDialog(state, { mode = authDialogModes.LOGIN, visible = true }) {
      state.authDialogMode = mode;
      state.authDialogVisible = visible;
    },
  },

  actions: {
    whoami({ commit }) {
      return rest.get('/user/me').then((resp) => {
        commit('setUser', resp.data);
        return resp;
      });
    },

    login({ commit }, { username, password }) {
      return rest.get('/user/authentication', {
        headers: {
          'Girder-Authorization': `Basic ${window.btoa(`${username}:${password}`)}`,
        },
      }).then((resp) => {
        commit('setUser', resp.data.user);
        commit('setToken', resp.data.authToken.token);
        return resp;
      });
    },

    logout({ commit }) {
      return rest.delete('/user/authentication').then(() => {
        commit('setUser', null);
        commit('setToken', null);
      });
    },

    register({ commit }, params) {
      return rest.post('/user', formEncode(params)).then((resp) => {
        commit('setToken', resp.data.authToken.token);
        commit('setUser', resp.data);
        return resp;
      });
    },
  },
};
