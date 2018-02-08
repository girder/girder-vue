export default {
  namespaced: true,
  state: {
    dialog: null
  },

  mutations: {
    showDialog (state, dialog) {
      state.dialog = dialog
    },

    hideDialog (state) {
      state.dialog = null
    }
  }
}
