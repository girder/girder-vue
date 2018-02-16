<template lang="pug">
v-card
  v-card-title
    h3.headline Log in
  form(@submit.prevent="login")
    v-card-text
      v-text-field(v-model="username", label="Username or email", autofocus)
      v-text-field(v-model="password", type="password", label="Password",
          :error-messages="errorMessages")
    v-card-actions
      v-btn(type="submit", color="primary", :disabled="loginInProgress",
          :loading="loginInProgress") Login
</template>

<script>
export default {
  props: {
    errorMessage: {
      default: '',
      type: String,
    },
    loginInProgress: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    errorMessages() {
      return this.errorMessage ? [this.errorMessage] : [];
    },
  },
  methods: {
    login() {
      this.$emit('login', {
        username: this.username,
        password: this.password,
      });
    },
    reset() {
      this.username = '';
      this.password = '';
    },
  },
};
</script>
