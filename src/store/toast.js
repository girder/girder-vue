import _ from 'lodash';

export default {
  namespaced: true,
  state: {
    toasts: [],
  },

  mutations: {
    addToast(state, obj) {
      state.toasts.push(obj);
    },
    removeToast(state, obj) {
      state.toasts = _.without(state.toasts, obj);
    },
  },

  actions: {
    // eslint-disable-next-line object-curly-newline
    showToast({ commit }, { text, icon, color, ms = 4000 }) {
      const obj = { text, icon, color };
      commit('addToast', obj);
      window.setTimeout(() => {
        commit('removeToast', obj);
      }, ms);
    },
  },
};
