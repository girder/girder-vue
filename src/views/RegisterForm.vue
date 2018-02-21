<template lang="pug">
v-card
  v-card-title
    h3.headline Register
  form(@submit.prevent="register")
    v-card-text
      v-text-field(v-model="username", label="Username", autofocus,
          :error-messages="listify(errors.login)")
      v-text-field(v-model="email", label="Email", :error-messages="listify(errors.email)")
      v-text-field(v-model="firstName", label="First name",
          :error-messages="listify(errors.firstName)")
      v-text-field(v-model="lastName", label="Last name",
          :error-messages="listify(errors.lastName)")
      v-text-field(v-model="password", type="password", label="Password",
          :error-messages="listify(errors.password)")
      v-text-field(v-model="retypePassword", type="password", label="Retype password",
          :error-messages="retypePasswordErrors")
      v-alert(type="error", :value="!!errors.NONE") {{ errors.NONE }}
    v-card-actions
      v-btn(type="submit", color="primary", :disabled="submitDisabled",
          :loading="registerInProgress") Register
</template>

<script>
export default {
  props: {
    errors: {
      default: () => ({}),
      type: Object,
    },
    registerInProgress: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      retypePassword: '',
      retypePasswordErrors: [],
    };
  },
  computed: {
    submitDisabled() {
      return !!this.retypePasswordErrors.length || this.registerInProgress;
    },
  },
  watch: {
    password() {
      this.validatePasswordsMatch();
    },
    retypePassword() {
      this.validatePasswordsMatch();
    },
  },
  methods: {
    register() {
      this.$emit('register', {
        login: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
      });
    },
    reset() {
      this.username = '';
      this.email = '';
      this.firstName = '';
      this.lastName = '';
      this.password = '';
      this.retypePassword = '';
    },
    validatePasswordsMatch() {
      if (this.password === this.retypePassword) {
        this.retypePasswordErrors = [];
      } else {
        this.retypePasswordErrors = ['Passwords do not match'];
      }
    },
    listify: v => (v ? [v] : []),
  },
};
</script>
