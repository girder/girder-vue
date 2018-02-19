<template lang="pug">
div
  slot
    folder(v-if="folder", :folder="folder", @destroy="destroy")
</template>

<script>
import rest from '@/rest';
import { fetchingContainer } from '@/utils/mixins';
import Folder from '../views/Folder';

export default {
  components: { Folder },
  mixins: [fetchingContainer],
  props: {
    id: {
      default: null,
      type: String,
    },
  },
  data: () => ({
    folder: null,
  }),
  methods: {
    destroy() {
      return rest.delete(`/folder/${this.id}`).then(() => {
        this.$emit('destroyed', this.folder);
        this.folder = null;
      });
    },
    fetch() {
      return rest.get(`/folder/${this.id}`).then(({ data }) => {
        this.folder = data;
      });
    },
  },
};
</script>
