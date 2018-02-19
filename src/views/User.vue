<template lang="pug">
div
  .display-1 {{ user.login }}
  data-browser-container.mt-4(:model="user")
</template>

<script>
import DataBrowserContainer from '../containers/DataBrowserContainer';

export default {
  components: { DataBrowserContainer },
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
};
</script>
