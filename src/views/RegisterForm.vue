<template lang="pug">
v-card
  v-card-title
    h3.headline Register
  form(@submit.prevent="register")
    v-card-text
      v-text-field(v-model="username", label="Username", autofocus, :error-messages="usernameErrors")
      v-text-field(v-model="email", label="Email", :error-messages="emailErrors")
      v-text-field(v-model="firstName", label="First name", :error-messages="firstNameErrors")
      v-text-field(v-model="lastName", label="Last name", :error-messages="lastNameErrors")
      v-text-field(v-model="password", type="password", label="Password", :error-messages="passwordErrors")
      v-text-field(v-model="retypePassword", type="password", label="Retype password", :error-messages="retypePasswordErrors")
    v-card-actions
      v-btn(type="submit", color="primary", :disabled="submitDisabled", :loading="registerInProgress") Register
</template>

<script>
export default {
  props: {
    errors: {
      default: () => ({}),
      type: Object
    },
    registerInProgress: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      retypePassword: '',
      retypePasswordErrors: []
    }
  },
  computed: {
    usernameErrors () {
      return this.errors.login ? [this.errors.login] : []
    },
    emailErrors () {
      return this.errors.email ? [this.errors.email] : []
    },
    firstNameErrors () {
      return this.errors.firstName ? [this.errors.firstName] : []
    },
    lastNameErrors () {
      return this.errors.lastName ? [this.errors.lastName] : []
    },
    passwordErrors () {
      return this.errors.password ? [this.errors.password] : []
    },
    submitDisabled () {
      return !!this.retypePasswordErrors.length || this.registerInProgress
    },
  },
  watch: {
    password () {
      this.validatePasswordsMatch()
    },
    retypePassword () {
      this.validatePasswordsMatch()
    }
  },
  methods: {
    register () {
      this.$emit('register', {
        login: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      })
    },
    validatePasswordsMatch () {
      if (this.password === this.retypePassword) {
        this.retypePasswordErrors = []
      } else {
        this.retypePasswordErrors = ['Passwords do not match']
      }
    }
  }
}
</script>
