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
  }),
  watch: {
    query() {
      this.$emit('queryChange', this.query);

      if (this.pending) {
        this.pending.finally(() => {
          this.search();
        });
      } else {
        this.search();
      }
    },
  },
  methods: {
    search() {
      if (!this.query) {
        this.$emit('clear');
        return;
      }

      this.pending = rest.get('/resource/search', {
        params: {
          mode: this.mode,
          q: this.query,
          types: JSON.stringify(this.types),
        },
      }).then(({ data }) => {
        this.$emit('results', { data });
      }).finally(() => {
        this.pending = null;
      });
    },
  },
};
</script>
