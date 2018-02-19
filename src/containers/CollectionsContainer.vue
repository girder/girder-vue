<template lang="pug">
div
  slot
    resource-list(:models="collections", model-type="collection", :can-create="canCreate",
        :subtitle="subtitle", @searchResults="showSearchResults", @searchCleared="fetch",
        :fetching="fetching", :has-next-page="hasNextPage", :current-page="currentPage",
        @next="fetchNextPage", @prev="fetchPrevPage", ref="view")
</template>

<script>
import rest, { formEncode } from '@/rest';
import { fetchingContainer, pagingContainer, sizeFormatter } from '@/utils/mixins';
import ResourceList from '../views/ResourceList';

export default {
  components: { ResourceList },
  mixins: [fetchingContainer, pagingContainer, sizeFormatter],
  data: () => ({
    collections: [],
    fetching: false,
  }),
  computed: {
    canCreate() {
      // TODO base this on the actual setting by doing an API call
      return this.isLoggedIn;
    },
  },
  methods: {
    create(obj) {
      return rest.post('/collection', formEncode(obj)).then(({ data }) => {
        this.$emit('created', data);
      });
    },
    fetch() {
      this.fetching = true;
      return rest.get('/collection', {
        params: this.pagingParams,
      }).then(({ data }) => {
        if (!this.$refs.view.searchQuery) {
          this.collections = this.transformDataPage(data);
        }
      }).finally(() => {
        this.fetching = false;
      });
    },
    showSearchResults(results) {
      this.collections = results.data.collection || [];
    },
    subtitle(collection) {
      return collection.size ? this.formatDataSize(collection.size) : 'No data';
    },
  },
};
</script>

