<template lang="pug">
data-browser(:model="model", :breadcrumbs="breadcrumbs", :items="items", :folders="folders",
    :loading="fetching", :router-links="true")
</template>

<script>
import rest from '../rest';
import { fetchingContainer } from '../utils/mixins';
import DataBrowser from '../views/DataBrowser';

export default {
  components: { DataBrowser },
  mixins: [fetchingContainer],
  props: {
    model: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    breadcrumbs: [],
    items: [],
    folders: [],
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
      this.fetching = true;
      this.items = [];
      this.folders = [];

      let fetchedFolders,
        fetchedItems = [];
      const requests = [rest.get('/folder', {
        params: {
          parentId: this.model._id,
          parentType: this.modelType,
        },
      }).then(({ data }) => {
        fetchedFolders = data;
      })];

      if (this.modelType === 'folder') {
        const fetchItems = rest.get('/item', {
          params: {
            folderId: this.model._id,
          },
        }).then(({ data }) => {
          fetchedItems = data;
        });

        const fetchRootPath = rest.get(`/folder/${this.model._id}/rootpath`).then(({ data }) => {
          this.breadcrumbs = data.concat([{
            type: this.modelType,
            object: this.model,
          }]);
        });

        requests.push(fetchItems, fetchRootPath);
      } else {
        this.breadcrumbs = [{
          type: this.modelType,
          object: this.model,
        }];
      }

      Promise.all(requests).finally(() => {
        this.folders = fetchedFolders;
        this.items = fetchedItems;
        this.fetching = false;
      });
    },
  },
};
</script>
