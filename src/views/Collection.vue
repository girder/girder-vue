<template lang="pug">
div
  .display-1 {{ collection.name }}
  markdown.body-2(v-if="collection.description", :text="collection.description")
  data-browser-container.mt-4(:model="collection")
</template>

<script>
import DataBrowserContainer from '../containers/DataBrowserContainer';
import Markdown from './Markdown';

export default {
  components: { DataBrowserContainer, Markdown },
  props: {
    collection: {
      required: true,
      type: Object,
    },
  },
};
</script>
