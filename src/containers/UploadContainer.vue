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
    async start() {
      this.uploading = true;
      const results = [];

      for (let i = 0; i < this.files.length; i += 1) {
        // We could upload these in parallel if we wanted.
        const file = this.files[i];
        file.status = 'uploading';
        try {
          // eslint-disable-next-line no-await-in-loop
          results.push(await uploadFile(file.file, this.model, {
            progress: (progress) => {
              file.progress = progress;
            },
          }));
          file.status = 'done';
        } catch (error) {
          if (error.response) {
            file.errorMessage = error.response.data.message;
          } else {
            file.errorMessage = 'Could not connect to the server.';
          }
          file.status = 'error';
          this.uploading = false;
          this.$emit('error', error);
          break;
        }
      }

      this.uploading = false;
      this.$emit('filesUploaded', results);
    },
  },
};
</script>
