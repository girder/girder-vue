<template lang="pug">
div
  // Breadcrumb bar
  slot(name="breadcrumbs")
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
  slot(name="actions")
    v-toolbar(dense, flat, color="blue-grey lighten-4")
      span
        v-checkbox(:hide-details="true", @click.prevent.stop="toggleAllCheckboxes",
            @mousedown.prevent.stop="", :indeterminate="checkedCount")
      v-btn.checkbox-actions(v-if="checkboxes", :disabled="!checkedCount")
        v-icon(size="18px", color="grey darken-1") check_box
        v-icon arrow_drop_down
      v-spacer
      v-btn(v-if="hasWriteAccess(model) && modelType === 'folder'", icon, color="success",
          @click="showUploader = true")
        v-icon file_upload
      v-btn(v-if="hasAdminAccess(model)", icon, color="warning")
        v-icon lock_outline
      v-btn(icon, dark, color="blue-grey lighten-2")
        v-icon menu

  // Loading indicator
  slot(name="loading")
    v-progress-linear.mt-0.mb-0(v-if="loading", indeterminate)

  // Folder list
  slot(name="folders")
    v-list.pb-0.pt-0(dense)
      v-list-tile(v-for="folder in folders_", @click="$emit('folderClick', folder.folder)",
          :key="folder.folder._id", :to="routeOpt(folder.folder)")
        v-list-tile-action.mr-2.checkbox-container(v-if="checkboxes")
          v-checkbox(@click.prevent="toggleChecked(folder)", v-model="folder.checked",
              :hide-details="true")
        v-badge.mr-2(overlap, color="transparent")
          v-icon(small, slot="badge", :color="folder.public ? 'blue' : 'amber'")
            | {{ folder.public ? 'public' : 'lock' }}
          v-icon(size="24px") {{ ResourceIcons.FOLDER }}
        v-list-tile-title.ml-1 {{ folder.folder.name }}

  // Item list
  slot(name="items")
    v-list.pb-0.pt-0(dense)
      v-list-tile(v-for="item in items_", @click="$emit('itemClick', item.item)", :key="item._id",
          :to="routeOpt(item.item)")
        v-list-tile-action.mr-2.checkbox-container(v-if="checkboxes")
          v-checkbox(@click.prevent="toggleChecked(item)", :input-value="item.checked",
              :hide-details="true")
        v-badge.mr-2(overlap, color="transparent")
          v-icon(small, slot="badge", :color="model.public ? 'blue' : 'amber'")
            | {{ model.public ? 'public' : 'lock' }}
          v-icon(size="24px") {{ ResourceIcons.ITEM }}
        v-list-tile-title.ml-1 {{ item.item.name }}

  // Empty status alert
  slot(name="empty_alert")
    v-alert.mt-0(:value="empty", type="info")
      | This {{ modelType }} is currently empty.

  // Upload container
  slot(name="uploader")
    v-dialog(v-if="modelType === 'folder'", v-model="showUploader", fullscreen, :overlay="false",
        scrollable, transition="dialog-bottom-transition")
      v-card(tile)
        upload-container.uploader(:model="model", @close="showUploader = false",
            @done="uploadFinished")
</template>

<script>
import { ResourceIcons } from '@/constants';
import { accessLevelChecker } from '@/utils/mixins';
import UploadContainer from '../containers/UploadContainer';

export default {
  components: { UploadContainer },
  mixins: [accessLevelChecker],
  props: {
    checkboxes: {
      default: true,
      type: Boolean,
    },
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
    routerLinks: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      ResourceIcons,
      showUploader: false,
      folders_: this.folders.map(folder => ({
        folder,
        checked: false,
      })),
      items_: this.items.map(item => ({
        item,
        checked: false,
      })),
    };
  },
  computed: {
    breadcrumbData() {
      return this.breadcrumbs.map(crumb => ({
        title: crumb.object.name || crumb.object.login,
        to: `/${crumb.type}/${crumb.object._id}`, // TODO no hardcode path
        icon: ResourceIcons[crumb.type.toUpperCase()],
        ...crumb,
      }));
    },
    checkedItems() {
      return this.items_.filter(item => item.checked);
    },
    checkedFolders() {
      return this.folders_.filter(folder => folder.checked);
    },
    checkedCount() {
      return this.checkedItems.length + this.checkedFolders.length;
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
    toggleAllCheckboxes() {
      // TODO implement
    },
    toggleChecked(model) {
      model.checked = !model.checked;
    },
    uploadFinished(files) {
      this.showUploader = false;
      this.$emit('uploadComplete', files);
    },
  },
};
</script>

<style lang="stylus" scoped>
.bc-link
  color #fff

  &:hover
    color #ddd

.uploader
  height 100%

.checkbox-container,.checkbox-actions
  min-width 0
</style>
