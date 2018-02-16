<template lang="pug">
div
  // Breadcrumb bar
  v-toolbar(dense, dark, flat, color="blue-grey")
    v-breadcrumbs.ml-0
      v-icon(slot="divider") keyboard_arrow_right
      v-breadcrumbs-item(v-for="crumb in breadcrumbData", :key="crumb.object._id", :to="crumb.to")
        v-icon {{ crumb.icon }}
        .bc-link.ml-1 {{ crumb.title }}
    v-spacer
    v-btn(v-if="breadcrumbs.length > 1", icon, @click="$emit('up')", :to="parentRouteOpt")
      v-icon arrow_upward

  // Action bar
  v-toolbar(v-if="showActions", dense, flat, color="blue-grey lighten-4")
    v-spacer
    v-btn(v-if="hasWriteAccess(model) && modelType === 'folder'", icon, color="success",
        @click="showUploader = true")
      v-icon file_upload
    v-btn(v-if="hasAdminAccess(model)", icon, color="warning")
      v-icon lock_outline
    v-btn(icon, dark, color="blue-grey lighten-2")
      v-icon menu

  // Loading indicator
  v-progress-linear.mt-0.mb-0(v-if="loading", indeterminate)

  // Folder list
  v-list.pb-0.pt-0(dense)
    v-list-tile(v-for="folder in folders", @click="$emit('folderClick', folder)", :key="folder._id",
        :to="routeOpt(folder)")
      v-icon {{ ResourceIcons.FOLDER }}
      v-list-tile-title.ml-1 {{ folder.name }}

  // Item list
  v-list.pb-0.pt-0(dense)
    v-list-tile(v-for="item in items", @click="$emit('itemClick', item)", :key="item._id",
        :to="routeOpt(item)")
      v-icon {{ ResourceIcons.ITEM }}
      v-list-tile-title.ml-1 {{ item.name }}

  // Empty status alert
  v-alert.mt-0(:value="empty", type="info", transition="scale-transition")
    | This {{ modelType }} is currently empty.

  // Upload container
  v-dialog(v-if="modelType === 'folder'", v-model="showUploader", fullscreen, :overlay="false",
      scrollable, transition="dialog-bottom-transition")
    v-card(tile)
      v-toolbar(card, dense, dark, color="success")
        v-toolbar-title UPLOAD
        v-spacer
        v-btn(icon, flat, @click="showUploader = false")
          v-icon close
    upload-container(:model="model")
</template>

<script>
import { ResourceIcons } from '@/constants';
import { accessLevelChecker } from '@/utils/mixins';
import UploadContainer from '../containers/UploadContainer';

export default {
  components: { UploadContainer },
  mixins: [accessLevelChecker],
  props: {
    loading: {
      default: false,
      type: Boolean,
    },
    model: {
      required: true,
      type: Object,
    },
    breadcrumbs: {
      default: null,
      type: Array,
    },
    folders: {
      default: () => [],
      type: Array,
    },
    items: {
      default: () => [],
      type: Array,
    },
    showActions: {
      default: true,
      type: Boolean,
    },
    routerLinks: {
      default: false,
      type: Boolean,
    },
  },
  data: () => ({
    ResourceIcons,
    showUploader: false,
  }),
  computed: {
    breadcrumbData() {
      return this.breadcrumbs.map(crumb => ({
        title: crumb.object.name || crumb.object.login,
        to: `/${crumb.type}/${crumb.object._id}`, // TODO no hardcode path
        icon: ResourceIcons[crumb.type.toUpperCase()],
        ...crumb,
      }));
    },
    empty() {
      return !this.folders.length && !this.items.length && !this.loading;
    },
    modelType() {
      return this.model._modelType;
    },
    parentRouteOpt() {
      return this.routerLinks ? `/${this.model.parentCollection}/${this.model.parentId}` : null; // TODO no hardcode path
    },
  },
  methods: {
    routeOpt(model) {
      return this.routerLinks ? `/${model._modelType}/${model._id}` : null; // TODO no hardcode path
    },
  },
};
</script>

<style lang="stylus" scoped>
.bc-link
  color #fff

  &:hover
    color #ddd
</style>
