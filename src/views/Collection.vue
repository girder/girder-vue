<template lang="pug">
div
  button(@click="$emit('destroy')") Delete collection
  h2 {{ collection.name }}
  .description(v-if="collection.description") {{ collection.description }}
</template>

<script>
export default {
  props: {
    collection: {
      default: () => { return {} },
      type: Object
    }
  }
}
</script>
