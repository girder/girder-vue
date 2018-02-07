<template lang="pug">
div
  ul
    li #[router-link(to="collections") Collections]
    li #[router-link(to="users") Users]
    li #[router-link(to="groups") Groups]
    li #[router-link(to="admin", v-if="isAdmin") Admin console]
  div
    a(v-if="isLoggedIn") {{ user.login }}
    div(v-else)
      a(@click="registerDialog") Register
      | or
      a(@click="loginDialog") Login
  router-view
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin'])
  },
  methods: {
    registerDialog: () => { console.log ('register!') },
    loginDialog: () => { console.log ('login!') }
  }
}
</script>
