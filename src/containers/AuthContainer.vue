<template lang="pug">
div
  login-form(v-if="loginMode", @login="doLogin", :error-message="loginErrorMessage", :login-in-progress="loginInProgress")
  register-form(v-if="registerMode", @register="doRegister", :errors="registerErrors", :register-in-progress="registerInProgress")
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { authDialogModes } from '@/store/auth'
import LoginForm from '../views/LoginForm'
import RegisterForm from '../views/RegisterForm'

// TODO add reset-password-form subcomponent

const emptyRegisterErrors = () => ({
  login: null,
  email: null,
  firstName: null,
  lastName: null,
  password: null
})

export default {
  components: { LoginForm, RegisterForm },
  props: {
    show: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    loginErrorMessage: '',
    loginInProgress: false,
    registerErrors: emptyRegisterErrors(),
    registerInProgress: false
  }),
  computed: {
    loginMode () { return this.authDialogMode === authDialogModes.LOGIN },
    registerMode () { return this.authDialogMode === authDialogModes.REGISTER },
    resetPasswordMode () { return this.authDialogMode === authDialogModes.PASSWORD_RESET },
    ...mapState('auth', ['authDialogMode'])
  },
  methods: {
    doLogin (credentials) {
      this.loginErrorMessage = ''
      this.loginInProgress = true
      this.login(credentials).then(() => {
        this.$emit('login')
      }).catch(({response}) => {
        this.loginErrorMessage = response.data.message
      }).finally(() => {
        this.loginInProgress = false
      })
    },
    doRegister (params) {
      this.registerErrors = emptyRegisterErrors()
      this.registerInProgress = true
      this.register(params).then(() => {
        this.$emit('register')
      }).catch(({response}) => {
        this.registerErrors[response.data.field] = response.data.message
      }).finally(() => {
        this.registerInProgress = false
      })
    },
    ...mapActions('auth', ['login', 'register'])
  }
}
</script>
