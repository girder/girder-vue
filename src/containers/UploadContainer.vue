<template lang="pug">
div
  slot
    upload(:model="model", :multiple="multiple", :error-message="errorMessage",
        :uploading="uploading", :files="files", @close="$emit('close')", @start="start",
        @resume="start", @clear="files = []", @filesChanged="filesChanged",
        @removeFile="removeFile")
      slot(v-for="name in viewSlots", :name="name", :slot="name")
</template>

<script>
import { mapActions } from 'vuex';
import { viewSlotWrapper } from '@/utils/mixins';
import { uploadFile, resumeUpload } from '@/utils/upload';
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
        upload: null,
        result: null,
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
        const file = this.files[i];

        if (file.status === 'done') {
          // We are resuming, skip already completed files
          results.push(file.result);
        } else {
          const progress = (event) => {
            file.progress = Object.assign({}, file.progress, event);
          };
          file.status = 'uploading';

          try {
            if (file.upload) {
              file.result = await resumeUpload(file.file, file.upload, { progress });
            } else {
              file.result = await uploadFile(file.file, this.model, { progress });
            }
            results.push(file.result);
            file.status = 'done';
          } catch (error) {
            if (error.response) {
              this.errorMessage = error.response.data.message;
            } else {
              this.errorMessage = 'Connection failed.';
            }
            file.upload = error.upload;
            file.status = 'error';
            this.uploading = false;
            this.$emit('error', error);
            return;
          }
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
