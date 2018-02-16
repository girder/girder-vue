<template lang="pug">
div
  h2 {{ folder.name }}
  div(v-if="folder.description") {{ folder.description }}
  data-browser-container.mt-4(:model="folder")
</template>

<script>
import DataBrowserContainer from '../containers/DataBrowserContainer';

export default {
  components: { DataBrowserContainer },
  props: {
    folder: {
      required: true,
      type: Object,
    },
  },
};
</script>
