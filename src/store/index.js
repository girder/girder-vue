import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import dialog from './dialog'
import layout from './layout'
import toast from './toast'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    dialog,
    layout,
    toast
  }
})
