import _ from 'lodash';

export default {
  namespaced: true,
  state: {
    toasts: _([]),
  },

  mutations: {
    addToast(state, obj) {
      state.toasts.push(obj);
    },
    removeToast(state, obj) {
      state.toasts.pull(obj);
    },
  },

  actions: {
    showToast({ commit }, { text, type, ms = 4000 }) {
      const obj = { text, type };
      commit('addToast', obj);
      window.setTimeout(() => {
        commit('removeToast', obj);
      }, ms);
    },
  },
};
