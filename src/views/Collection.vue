<template lang="pug">
div
  h2 {{ collection.name }}
  .description(v-if="collection.description") {{ collection.description }}

  data-browser-container.mt-4(:model="collection", model-type="collection")
</template>

<script>
import DataBrowserContainer from '../containers/DataBrowserContainer'

export default {
  components: { DataBrowserContainer },
  props: {
    collection: {
      required: true,
      type: Object
    }
  }
}
</script>
