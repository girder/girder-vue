import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import toast from './toast';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    toast,
  },
});
