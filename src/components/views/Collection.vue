<template lang="pug">
div
  h2 {{ collection.name }}
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
