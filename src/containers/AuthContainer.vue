<template lang="pug">
div
  slot
    login-form(v-if="loginMode", ref="loginForm", @login="doLogin",
        :error-message="loginErrorMessage", :login-in-progress="loginInProgress")
    register-form(v-if="registerMode", ref="registerForm", @register="doRegister",
        :errors="registerErrors", :register-in-progress="registerInProgress")
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { authDialogModes } from '@/store/auth';
import LoginForm from '../views/LoginForm';
import RegisterForm from '../views/RegisterForm';

// TODO add reset-password-form subcomponent

const emptyRegisterErrors = () => ({
  login: null,
  email: null,
  firstName: null,
  lastName: null,
  password: null,
  NONE: null,
});

export default {
  components: { LoginForm, RegisterForm },
  data: () => ({
    loginErrorMessage: '',
    loginInProgress: false,
    registerErrors: emptyRegisterErrors(),
    registerInProgress: false,
  }),
  computed: {
    loginMode() { return this.authDialogMode === authDialogModes.LOGIN; },
    registerMode() { return this.authDialogMode === authDialogModes.REGISTER; },
    resetPasswordMode() { return this.authDialogMode === authDialogModes.PASSWORD_RESET; },
    ...mapState('auth', ['authDialogMode']),
  },
  methods: {
    doLogin(credentials) {
      this.loginErrorMessage = '';
      this.loginInProgress = true;
      return this.login(credentials).then(() => {
        this.$emit('login');
        this.$refs.loginForm.reset();
      }).catch(({ response }) => {
        if (response) {
          this.loginErrorMessage = response.data.message;
        } else {
          this.loginErrorMessage = 'Could not connect to server.';
        }
      }).finally(() => {
        this.loginInProgress = false;
      });
    },
    doRegister(params) {
      this.registerErrors = emptyRegisterErrors();
      this.registerInProgress = true;
      return this.register(params).then(() => {
        this.$emit('register');
        this.$refs.registerForm.reset();
      }).catch(({ response }) => {
        if (response) {
          this.registerErrors[response.data.field || 'NONE'] = response.data.message;
        } else {
          this.registerErrors = 'Could not connect to server.';
        }
      }).finally(() => {
        this.registerInProgress = false;
      });
    },
    ...mapActions('auth', ['login', 'register']),
  },
};
</script>
