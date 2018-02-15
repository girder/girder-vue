<template lang="pug">
div
  h2 {{ collection.name }}
  div(v-if="collection.description") {{ collection.description }}
  data-browser-container.mt-4(:model="collection")
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
