<template lang="pug">
div
  v-toolbar(color="transparent", flat)
    v-toolbar-title {{ title_ }}
    v-spacer
    v-tooltip(bottom)
      v-btn(large, v-if="canCreate", icon, @click="showCreateDialog = true", color="primary",
          slot="activator")
        v-icon(large, color="white") add
      span Create {{ modelType }}

  v-text-field(prepend-icon="search", :placeholder="`Search ${modelNamePlural_}`",
     clearable, :loading="searching", v-model="searchText")

  slot(name="subheader")

  v-list.py-0(two-line)
    v-list-tile(v-for="model in models", :key="model._id", @click="$emit('clicked', model)",
        :to="routeOpt(model)")
      v-list-tile-avatar
        v-badge.mr-2(overlap, color="transparent")
          v-icon(small, slot="badge", :color="model.public ? 'blue' : 'amber'")
            | {{ model.public ? 'public' : 'lock' }}
          v-icon(size="24px") {{ icon_ }}
      v-list-tile-content
        v-list-tile-title {{ model.name }}
        v-list-tile-sub-title {{ subtitle(model) }}

  v-alert(:value="!models.length && !searching", type="info") {{ emptyText }}
  v-dialog(v-model="showCreateDialog", max-width="500px")
    slot(name="createDialog")
</template>

<script>
import { ResourceIcons } from '@/constants';

export default {
  props: {
    canCreate: {
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
    searching: {
      default: false,
      type: Boolean,
    },
    subtitle: {
      default: () => '',
      type: Function,
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
      searchText: '',
      showCreateDialog: false,
    };
  },
  computed: {
    emptyText() {
      if (this.searchText) {
        return `No matching ${this.modelNamePlural_}.`;
      }
      return `There are no ${this.modelNamePlural_} to show.`;
    },
    modelNamePlural_() {
      return this.modelNamePlural || `${this.modelType}s`;
    },
    icon_() {
      return this.icon || ResourceIcons[this.modelType.toUpperCase()];
    },
    title_() {
      return this.title || this.modelNamePlural_.charAt(0).toUpperCase() +
        this.modelNamePlural_.slice(1);
    },
  },
  watch: {
    searchText() {
      this.$emit('search', this.searchText);
    },
  },
  methods: {
    routeOpt(model) {
      return this.routerLinks ? `/${model._modelType}/${model._id}` : null;
    },
  },
};
</script>
