<template lang="pug">
div
  slot
    item(v-if="item", :item="item", @destroy="destroy")
</template>

<script>
import rest from '@/rest';
import { fetchingContainer } from '@/utils/mixins';
import Item from '@/views/Item';

export default {
  components: { Item },
  mixins: [fetchingContainer],
  props: {
    id: {
      default: null,
      type: String,
    },
  },
  data: () => ({
    item: null,
  }),
  methods: {
    destroy() {
      return rest.delete(`/item/${this.id}`).then(() => {
        this.$emit('destroyed', this.folder);
        this.item = null;
      });
    },
    fetch() {
      return rest.get(`/item/${this.id}`).then(({ data }) => {
        this.item = data;
      });
    },
  },
};
</script>
