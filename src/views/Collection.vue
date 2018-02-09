<template lang="pug">
div
  h2 {{ collection.name }}
  .description(v-if="collection.description") {{ description }}
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
