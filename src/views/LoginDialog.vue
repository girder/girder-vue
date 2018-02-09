<template lang="pug">
modal(@close="$emit('close')")
  div(slot="header") Log in
  div(slot="body")
    form(@submit.prevent="login")
      input(v-model="username", placeholder="Enter login or email", autofocus)
      input(type="password", v-model="password", placeholder="Enter password")
      input(type="submit", style="display: none;")
    .err-msg {{ errorMessage }}
  div(slot="footer")
    button(@click="login") Login
</template>

<script>
import Modal from './Modal'

export default {
  components: { Modal },
  data () {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login () {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
    }
  },
  props: {
    errorMessage: {
      default: '',
      type: String
    }
  }
}
</script>

<style lang="stylus" scoped>
.err-msg
  color red
  font-weight bold
</style>
