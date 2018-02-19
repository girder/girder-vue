<template lang="pug">
div
  .display-1 {{ collection.name }}
  .body-2(v-if="collection.description") {{ collection.description }}
  data-browser-container.mt-4(:model="collection")
</template>

<script>
import DataBrowserContainer from '../containers/DataBrowserContainer';

export default {
  components: { DataBrowserContainer },
  props: {
    collection: {
      required: true,
      type: Object,
    },
  },
};
</script>
