<template lang="pug">
div
  slot
    data-browser(ref="view", :model="model", :breadcrumbs="breadcrumbs", :items="items",
        :folders="folders", :files="files", :loading="fetching", :router-links="routerLinks",
        @uploadComplete="fetch", @folderCreated="fetch")
      slot(v-for="name in viewSlots", :name="name", :slot="name")
</template>

<script>
import { fetchChildren, fetchRootPath } from '@/rest';
import { fetchingContainer, viewSlotWrapper } from '@/utils/mixins';
import DataBrowser from '@/views/DataBrowser';

export default {
  components: { DataBrowser },
  mixins: [fetchingContainer, viewSlotWrapper],
  props: {
    model: {
      required: true,
      type: Object,
    },
    routerLinks: {
      default: true,
      type: Boolean,
    },
  },
  data: () => ({
    breadcrumbs: [],
    items: [],
    folders: [],
    files: [],
    fetching: false,
  }),
  computed: {
    modelType() {
      return this.model._modelType;
    },
  },
  watch: {
    model() {
      this.fetch();
    },
  },
  methods: {
    fetch() {
      this.$refs.view.showUploader = false;
      this.fetching = true;

      this.items = [];
      this.folders = [];
      this.files = [];

      return (
        fetchChildren(this.model)
          .then((resources) => {
            this.items = resources.filter(r => r._modelType === 'item');
            this.folders = resources.filter(r => r._modelType === 'folder');
            this.files = resources.filter(r => r._modelType === 'file');
          })
          .then(() => fetchRootPath(this.model))
          .then((path) => {
            this.breadcrumbs = path;
            this.fetching = false;
          })
      );
    },
  },
};
</script>
