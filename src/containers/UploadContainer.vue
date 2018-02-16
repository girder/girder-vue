<template lang="pug">
div
</template>

<script>
import { ResourceIcons } from '@/constants';

export default {
  props: {
    model: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    ResourceIcons,
  }),
};
</script>
