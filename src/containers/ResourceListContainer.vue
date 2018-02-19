<template lang="pug">
div
  slot
    resource-list(ref="view", :models="models", :model-type="modelType", :can-create="canCreate",
        :get-subtitle="getSubtitle", :get-title="getTitle", :fetching="fetching",
        :has-next-page="hasNextPage", :current-page="currentPage",
        @searchResults="showSearchResults", @searchCleared="fetch", @next="fetchNextPage",
        @prev="fetchPrevPage")
      component(v-if="canCreate && createView", :is="createView", slot="createDialog",
          @create="create")
</template>

<script>
import rest, { formEncode } from '@/rest';
import { fetchingContainer, pagingContainer } from '@/utils/mixins';
import ResourceList from '../views/ResourceList';

/**
 * This is an abstract base component that should be extended for individual resource types.
 */
export default {
  components: { ResourceList },
  mixins: [fetchingContainer, pagingContainer],
  data: () => ({
    createView: null,
    fetching: false,
    models: [],
    modelType: '',
  }),
  computed: {
    canCreate: () => false,
  },
  methods: {
    create(obj) {
      return rest.post(`/${this.modelType}`, formEncode(obj)).then(({ data }) => {
        this.$emit('created', data);
        this.$refs.view.showCreateDialog = false;
      });
    },
    fetch() {
      this.fetching = true;
      return rest.get(`/${this.modelType}`, {
        params: this.pagingParams,
      }).then(({ data }) => {
        if (!this.$refs.view.searchQuery) {
          this.models = this.transformDataPage(data);
        }
      }).finally(() => {
        this.fetching = false;
      });
    },
    showSearchResults(results) {
      this.models = results.data[this.modelType] || [];
    },
    getSubtitle: () => '',
    getTitle: model => model.name,
  },
};
</script>

