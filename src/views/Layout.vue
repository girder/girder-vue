<template lang="pug">
v-app
  v-navigation-drawer(fixed, :clipped="$vuetify.breakpoint.mdAndUp", app, v-model="drawer")
    v-list(dense)
      v-list-tile(v-for="item in navItems", :key="item.id", v-if="isNavItemVisible(item)", @click="")
        v-list-tile-action(v-if="item.icon")
          v-icon {{ item.icon }}
        v-list-tile-content
          v-list-tile-title {{ item.text }}
  v-toolbar(:color="toolbarColor", dark, app, :clipped-left="$vuetify.breakpoint.mdAndUp", fixed)
    v-toolbar-title.pr-4.ml-1
     v-toolbar-side-icon(@click.stop="drawer = !drawer")
     span.hidden-xs-only {{ title }}
    v-text-field(flat, solo-inverted, prepend-icon="search", label="Search...")
    v-spacer
  div(v-if="isLoggedIn")
    div Logged in as {{ user.login }}
    a(@click="doLogout") Log out
  div(v-else)
    a(@click="showDialog('register')") Register
    |  or
    a(@click="showDialog('login')")  Login
  .g-nav
    ul
      router-link(tag="li", to="/collections") #[a Collections]
      router-link(v-if="isLoggedIn", tag="li", :to="`/user/${user._id}`") #[a My data]
      router-link(tag="li", to="/users") #[a Users]
      router-link(tag="li", to="/groups") #[a Groups]
      router-link(v-if="isAdmin", tag="li", to="/admin") #[a Admin console]
  .g-page-body #[router-view]
  .g-footer
    a(:href="getApiUrl") Web API
  login-container(v-if="dialog === 'login'", :view-component="loginView")
  register-container(v-if="dialog === 'register'", :view-component="registerView")
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { getApiUrl } from '@/rest'
import LoginContainer from '../containers/LoginContainer'
import RegisterContainer from '../containers/RegisterContainer'
import LoginDialog from './LoginDialog'
import RegisterDialog from './RegisterDialog'

export default {
  components: {
    LoginContainer,
    RegisterContainer
  },
  data: () => ({
    drawer: null,
    loginView: LoginDialog,
    registerView: RegisterDialog,
  }),
  computed: {
    getApiUrl,
    ...mapState('auth', ['user']),
    ...mapState('dialog', ['dialog']),
    ...mapState('layout', ['navItems', 'title', 'toolbarColor']),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin'])
  },
  methods: {
    doLogout () {
      this.logout()
      this.$router.push({path: '/'})
    },
    isNavItemVisible (item) {
      if (item.requireAdmin === true) {
        return this.isAdmin
      }
      if (item.requireLogin === true) {
        return this.isLoggedIn
      }
      return true
    },
    ...mapActions('auth', ['logout']),
    ...mapMutations('dialog', ['showDialog', 'hideDialog'])
  }
}
</script>
