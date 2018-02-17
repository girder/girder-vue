<template lang="pug">
upload(ref="view", :model="model", :multiple="multiple", :error-message="errorMessage",
    :uploading="uploading", @close="$emit('close')")
  slot(name="dropzone", slot="dropzone")
  slot(name="files", slot="files")
  slot(name="header", slot="header")
  slot(name="toolbar", slot="toolbar")
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
    errorMessage: null,
    statusMessage: null,
    uploading: false
  }),
};
</script>
