<template lang="pug">
div
  slot
    search(v-model="query", :loading="!!this.pending", :placeholder="placeholder")
</template>

<script>
import { AccessType } from '@/constants';
import rest from '@/rest';
import Search from '../views/Search';

export default {
  components: { Search },
  props: {
    level: {
      default: AccessType.READ,
      type: Number,
    },
    mode: {
      default: 'prefix',
      type: String,
    },
    placeholder: {
      default: 'Search',
      type: String,
    },
    types: {
      required: true,
      type: Array,
    },
  },
  data: () => ({
    query: '',
    pending: null,
    next: null,
  }),
  watch: {
    query() {
      this.$emit('queryChange', this.query);

      if (this.pending) {
        this.next = this.query;
      } else {
        this.search(this.query);
      }
    },
  },
  methods: {
    search(q) {
      if (!q) {
        this.$emit('clear');
        return;
      }

      this.pending = rest.get('/resource/search', {
        params: {
          q,
          mode: this.mode,
          types: JSON.stringify(this.types),
        },
      }).then(({ data }) => {
        if (this.next !== null) {
          this.search(this.next);
          this.next = null;
        }
        this.$emit('results', { data });
      }).finally(() => {
        this.pending = null;
      });
    },
  },
};
</script>
