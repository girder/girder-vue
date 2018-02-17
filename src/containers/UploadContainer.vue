<template lang="pug">
upload(:model="model", :multiple="multiple", :error-message="errorMessage",
    :uploading="uploading", :files="files", @close="$emit('close')", @start="start",
    @clear="files = []", @filesChanged="filesChanged", @removeFile="removeFile")
  slot(name="dropzone", slot="dropzone")
  slot(name="files", slot="files")
  slot(name="header", slot="header")
  slot(name="progress", slot="progress")
  slot(name="toolbar", slot="toolbar")
</template>

<script>
import { uploadFile } from '@/utils/upload';
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
    uploading: false,
    files: [],
  }),
  methods: {
    filesChanged(files) {
      this.files = [...files].map(file => ({ file }));
    },
    removeFile(i) {
      this.files.splice(i, 1);
    },
    start() {
      this.uploading = true;

      let chain = Promise.resolve();

      this.files.forEach((file) => {
        chain = chain.then(() => {
          return uploadFile(file.file, this.model, {
            progress: (progress) => {
              file.progress = progress;
            },
          });
        });
      });

      chain.then((f) => {
        console.log('we are done!', f);
      }).catch((e) => {
        console.log('we failed!', e.response.response);
      });
    },
  },
};
</script>
