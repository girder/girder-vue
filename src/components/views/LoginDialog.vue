<template lang="pug">
modal(which-dialog="login")
  div(slot="header") Log in
  div(slot="body")
    form(@submit.prevent="doLogin")
      input(v-model="username", placeholder="Enter login or email", autofocus)
      input(type="password", v-model="password", placeholder="Enter password")
      input(type="submit", style="display: none;")
      .err-msg(v-if="loginFailedMessage") {{ loginFailedMessage }}
  div(slot="footer")
    button(@click="doLogin") Login
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Modal from './Modal'

export default {
  data () {
    return {
      username: '',
      password: '',
      loginFailedMessage: null
    }
  },
  components: {
    Modal
  },
  methods: {
    doLogin () {
      this.loginFailedMessage = null

      this.login({
        username: this.username,
        password: this.password
      }).then(() => {
        this.hideDialog()
      }).catch(({response}) => {
        this.loginFailedMessage = response.data.message
      })
    },
    ...mapActions('auth', ['login']),
    ...mapMutations('dialog', ['hideDialog'])
  }
}
</script>

<style lang="stylus" scoped>
.err-msg
  color red
  font-weight bold
</style>
