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
    v-btn(color="primary", @click.stop="login") Login
</template>

<script>
export default {
  props: {
    errorMessage: {
      default: '',
      type: String
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
    },
    getError () {
      return this.errorMessage || true
    }
  }
}
</script>
