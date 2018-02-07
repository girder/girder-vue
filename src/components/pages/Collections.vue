<template lang="pug">
h2 This is the collections page
</template>

<script>
export default {
  created () {
    this.$store.dispatch('collections/fetchList')
  }
}
</script>

<style lang="stylus" scoped>
h2
  color red
</style>
