<template lang="pug">
div
  h2.headline {{ title }}

  v-btn(v-if="canCreate", @click="showCreateDialog = true")
    v-icon.mr-2 add
    | Create {{ modelType }}

  slot(name="subheader")

  v-list.py-0(two-line)
    v-list-tile(v-for="model in models", :key="model._id", @click="$emit('clicked', model)",
        :to="routeOpt(model)")
      v-list-tile-avatar
        v-icon {{ icon_ }}
      v-list-tile-content
        v-list-tile-title {{ model.name }}
        v-list-tile-sub-title {{ subtitle(model) }}
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
    models: {
      default: () => [],
      type: Array,
    },
    modelType: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    subtitle: {
      default: () => '',
      type: Function,
    },
    routerLinks: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      showCreateDialog: false,
    };
  },
  computed: {
    icon_() {
      return this.icon || ResourceIcons[this.modelType.toUpperCase()];
    },
  },
  methods: {
    routeOpt(model) {
      return this.routerLinks ? `/${model._modelType}/${model._id}` : null;
    },
  },
};
</script>
