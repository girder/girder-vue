<template lang="pug">
div
  slot
    data-browser(ref="view", :model="model", :breadcrumbs="breadcrumbs", :items="items",
        :folders="folders", :loading="fetching", :router-links="routerLinks",
        :checked-actions="checkedActions_", @checked="checkboxesChanged", @uploadComplete="fetch",
        @checkedActionClick="checkedActionClick", @folderCreated="fetch")
      slot(v-for="name in viewSlots", :name="name", :slot="name")
</template>

<script>
import { mapState } from 'vuex';
import rest from '@/rest';
import { accessLevelChecker, fetchingContainer, viewSlotWrapper } from '../utils/mixins';
import DataBrowser from '../views/DataBrowser';

export default {
  components: { DataBrowser },
  mixins: [accessLevelChecker, fetchingContainer, viewSlotWrapper],
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
    checkedActions_: [],
    items: [],
    folders: [],
    fetching: false,
  }),
  computed: {
    modelType() {
      return this.model._modelType;
    },
    ...mapState('dataBrowser', ['actions', 'checkedActions']),
  },
  watch: {
    model() {
      this.fetch();
    },
  },
  methods: {
    // Figure out which actions the user can take given the set of checked resources
    checkboxesChanged(checked) {
      this.checkedActions_ = this.checkedActions.filter(a =>
        !a.condition || a.condition.call(this, checked));
    },
    checkedActionClick({ action, checkedResources }) {
      if (action.click) {
        action.click.call(this, checkedResources);
      }
    },
    fetch() {
      this.$refs.view.showUploader = false;
      this.fetching = true;
      this.items = [];
      this.folders = [];

      let fetchedFolders;
      let fetchedItems = [];
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

      return Promise.all(requests).finally(() => {
        this.folders = fetchedFolders;
        this.items = fetchedItems;
        this.fetching = false;
      });
    },
  },
};
</script>
