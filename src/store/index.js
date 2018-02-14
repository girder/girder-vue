import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import layout from './layout'
import toast from './toast'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    layout,
    toast
  }
})
