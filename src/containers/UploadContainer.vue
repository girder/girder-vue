<template lang="pug">
upload(ref="view", :model="model", :multiple="multiple", :error-message="errorMessage",
    @close="$emit('close')")
  slot(name="toolbar", slot="toolbar")
  slot(name="header", slot="header")
</template>

<script>
import Upload from '../views/Upload';

export default {
  components: { Upload },
  props: {
    model: {
      required: true,
      type: Object,
    },
    multiple: {
      default: true,
      type: Boolean,
    },
  },
  data: () => ({
    errorMessage: null
  }),
};
</script>
