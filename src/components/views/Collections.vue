<template lang="pug">
div
  h2 Collections
  ul
    li(v-for="collection in collections")
      router-link(:to="`collection/${collection._id}`") {{ collection.name }}
</template>

<script>
export default {
  props: {
    collections: {
      default: () => [],
      type: Array
    }
  }
}
</script>
