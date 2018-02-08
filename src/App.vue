<template lang="pug">
#app
  router-view

</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.dispatch('auth/whoami')
  }
}
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

  a
    cursor pointer
</style>
