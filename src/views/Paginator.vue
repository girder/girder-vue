<template lang="pug">
div
  v-btn.pager-button(small, :disabled="currentPage === 0", @click="$emit('prev')")
    v-icon keyboard_arrow_left
  span.body-2.mx-2 {{ currentPage + 1 }}
  v-btn.pager-button(small, :disabled="!hasNextPage", @click="$emit('next')")
    v-icon keyboard_arrow_right
</template>

<script>
export default {
  props: {
    hasNextPage: {
      default: false,
      type: Boolean,
    },
    currentPage: {
      default: 0,
      type: Number,
    },
  },
};
</script>

<style lang="stylus" scoped>
.pager-button
  min-width 0
</style>
