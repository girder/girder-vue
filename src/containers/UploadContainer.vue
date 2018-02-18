<template lang="pug">
upload(:model="model", :multiple="multiple", :error-message="errorMessage",
    :uploading="uploading", :files="files", @close="$emit('close')", @start="start",
    @clear="files = []", @filesChanged="filesChanged", @removeFile="removeFile")
  slot(v-for="name in viewSlots", :name="name", :slot="name")
</template>

<script>
import { mapActions } from 'vuex';
import { viewSlotWrapper } from '@/utils/mixins';
import { uploadFile } from '@/utils/upload';
import Upload from '../views/Upload';

export default {
  components: { Upload },
  mixins: [viewSlotWrapper],
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
      this.files = [...files].map(file => ({
        file,
        status: 'pending',
        progress: {},
      }));
    },
    removeFile(i) {
      this.files.splice(i, 1);
    },
    async start() {
      this.uploading = true;
      this.errorMessage = null;

      const results = [];

      // eslint-disable-next-line no-await-in-loop
      for (let i = 0; i < this.files.length; i += 1) {
        // We could upload these in parallel if we wanted.
        const file = this.files[i];
        file.status = 'uploading';
        try {
          results.push(await uploadFile(file.file, this.model, {
            progress: (progress) => {
              file.progress = progress;
            },
          }));
          file.status = 'done';
        } catch (error) {
          if (error.response) {
            this.errorMessage = error.response.data.message;
          } else {
            this.errorMessage = 'Connection failed.';
          }
          file.status = 'error';
          this.uploading = false;
          this.$emit('error', error);
          return;
        }
      }

      this.uploading = false;
      this.showToast({
        text: 'Upload complete',
        color: 'success',
        icon: 'check_circled',
        ms: 3000,
      });
      this.files = [];
      this.$emit('done', results);
    },
    ...mapActions('toast', ['showToast']),
  },
};
</script>
