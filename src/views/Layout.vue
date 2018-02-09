<template lang="pug">
.g-layout
  .g-header
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
  login-container(v-if="dialog === 'login'")
  register-container(v-if="dialog === 'register'")
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { getApiUrl } from '@/rest'
import LoginContainer from '../containers/LoginContainer'
import RegisterContainer from '../containers/RegisterContainer'

export default {
  components: {
    LoginContainer,
    RegisterContainer
  },
  computed: {
    getApiUrl,
    ...mapState('auth', ['user']),
    ...mapState('dialog', ['dialog']),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin'])
  },
  methods: {
    doLogout () {
      this.logout()
      this.$router.push({path: '/'})
    },
    ...mapActions('auth', ['logout']),
    ...mapMutations('dialog', ['showDialog', 'hideDialog'])
  }
}
</script>
