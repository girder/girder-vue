<template lang="pug">
login-form(v-if="loginMode", @login="doLogin", :error-message="errorMessage")
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { authDialogModes } from '@/store/auth'
import LoginForm from '../views/LoginForm'

// TODO add register-form and reset-password-form subcomponents

export default {
  components: { LoginForm },
  props: {
    show: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    errorMessage: ''
  }),
  computed: {
    loginMode () { return this.authDialogMode === authDialogModes.LOGIN },
    registerMode () { return this.authDialogMode === authDialogModes.REGISTER },
    resetPasswordMode () { return this.authDialogMode === authDialogModes.PASSWORD_RESET },
    ...mapState('auth', ['authDialogMode'])
  },
  methods: {
    doLogin (credentials) {
      this.errorMessage = ''
      this.login(credentials).then(() => {
        this.$emit('login')
      }).catch(({response}) => {
        this.errorMessage = response.data.message
      })
    },
    ...mapActions('auth', ['login'])
  }
}
</script>
