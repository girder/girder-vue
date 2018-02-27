<template lang="pug">
div
  .display-1 {{ item.name }}
  markdown.body-2(v-if="item.description", :text="item.description")
  data-browser-container.mt-4(:model="item")
</template>

<script>
import DataBrowserContainer from '../containers/DataBrowserContainer';
import Markdown from './Markdown';

export default {
  components: { DataBrowserContainer, Markdown },
  props: {
    item: {
      required: true,
      type: Object,
    },
  },
};
</script>
