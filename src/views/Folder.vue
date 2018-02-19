<template lang="pug">
div
  .display-1 {{ folder.name }}
  markdown.body-2(v-if="folder.description", :text="folder.description")
  data-browser-container.mt-4(:model="folder")
</template>

<script>
import DataBrowserContainer from '../containers/DataBrowserContainer';
import Markdown from './Markdown';

export default {
  components: { DataBrowserContainer, Markdown },
  props: {
    folder: {
      required: true,
      type: Object,
    },
  },
};
</script>
