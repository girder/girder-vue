<template lang="pug">
v-card
  v-card-title
    h3.headline Log in
  v-card-text
    form(@submit.prevent="login")
      v-text-field(v-model="username", label="Username or email")
      v-text-field(v-model="password", type="password", label="Password", :error-messages="errorMessages")
      input(type="submit", style="display: none;")
  v-card-actions
    v-btn(color="primary", @click.stop="login", :disabled="loginInProgress", :loading="loginInProgress") Login
</template>

<script>
export default {
  props: {
    errorMessage: {
      default: '',
      type: String
    },
    loginInProgress: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    errorMessages () {
      return this.errorMessage ? [this.errorMessage] : []
    }
  },
  methods: {
    login () {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
