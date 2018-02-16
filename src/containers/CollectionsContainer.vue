<template lang="pug">
collections(:collections="collections", @create="create")
</template>

<script>
import rest, { formEncode } from '@/rest';
import { fetchingContainer } from '@/utils/mixins';
import Collections from '../views/Collections';

export default {
  components: { Collections },
  mixins: [fetchingContainer],
  data: () => ({
    collections: [],
  }),
  methods: {
    create(obj) {
      rest.post('/collection', formEncode(obj)).then(({ data }) => {
        this.$emit('created', data);
      });
    },
    fetch() {
      rest.get('/collection').then(({ data }) => {
        this.collections = data;
      });
    },
  },
};
</script>

