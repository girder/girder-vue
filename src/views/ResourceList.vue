<template lang="pug">
div
  slot(name="toolbar")
    v-toolbar(color="transparent", flat)
      v-toolbar-title {{ title_ }}
      v-spacer
      v-tooltip(bottom)
        v-btn(large, v-if="canCreate", icon, @click="showCreateDialog = true", color="primary",
            slot="activator")
          v-icon(large, color="white") add
        span Create {{ modelType }}

  slot(name="subheader")

  slot(name="search")
    search-container(prepend-icon="search", :placeholder="`Search ${modelNamePlural_}`",
       :types="[modelType]", @clear="$emit('searchCleared')", @results="showSearchResults",
       v-model="searchQuery")

  paginator(v-if="showPaginator", :current-page="currentPage", :has-next-page="hasNextPage",
      @next="$emit('next')", @prev="$emit('prev')")

  v-progress-linear.my-0(v-if="fetching", indeterminate, height="8")
  v-progress-linear.my-0(v-else, height="8", color="transparent", :value="0")

  v-list.py-0(two-line)
    v-list-tile(v-for="model in models", :key="model._id", @click="$emit('clicked', model)",
        :to="routeOpt(model)")
      v-list-tile-avatar
        v-badge.mr-2(overlap, color="transparent")
          v-icon(small, slot="badge", :color="model.public ? 'blue' : 'amber'")
            | {{ model.public ? 'public' : 'lock' }}
          v-icon(size="24px") {{ icon_ }}
      v-list-tile-content
        v-list-tile-title {{ getTitle(model) }}
        v-list-tile-sub-title {{ getSubtitle(model) }}

  v-alert(:value="!models.length && !fetching", type="info") {{ emptyText }}

  v-dialog(v-model="showCreateDialog", max-width="500px")
    slot(name="createDialog")
</template>

<script>
import { ResourceIcons } from '@/constants';
import Paginator from './Paginator';
import SearchContainer from '../containers/SearchContainer';

export default {
  components: { Paginator, SearchContainer },
  props: {
    canCreate: {
      default: false,
      type: Boolean,
    },
    currentPage: {
      default: 1,
      type: Number,
    },
    fetching: {
      default: false,
      type: Boolean,
    },
    getSubtitle: {
      default: () => '',
      type: Function,
    },
    getTitle: {
      default: model => model.name,
      type: Function,
    },
    hasNextPage: {
      default: false,
      type: Boolean,
    },
    icon: {
      default: null,
      type: String,
    },
    modelNamePlural: {
      default: null,
      type: String,
    },
    models: {
      default: () => [],
      type: Array,
    },
    modelType: {
      required: true,
      type: String,
    },
    routerLinks: {
      default: true,
      type: Boolean,
    },
    title: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      showCreateDialog: false,
      searchQuery: '',
    };
  },
  computed: {
    emptyText() {
      return `No ${this.modelNamePlural_} to display.`;
    },
    modelNamePlural_() {
      return this.modelNamePlural || `${this.modelType}s`;
    },
    icon_() {
      return this.icon || ResourceIcons[this.modelType.toUpperCase()];
    },
    showPaginator() {
      return (this.hasNextPage || this.currentPage > 0) && !this.searchQuery;
    },
    title_() {
      return this.title || this.modelNamePlural_.charAt(0).toUpperCase() +
        this.modelNamePlural_.slice(1);
    },
  },
  methods: {
    routeOpt(model) {
      return this.routerLinks ? `/${model._modelType}/${model._id}` : null;
    },
    showSearchResults(results) {
      this.$emit('searchResults', results);
    },
  },
};
</script>
