<template lang="pug">
v-card(tile)
  slot(name="toolbar")
    v-toolbar(dense, dark, color="success")
      v-btn(icon, flat, @click="$emit('close')")
        v-icon close
      v-toolbar-title Upload
  .px-0.py-2
    slot(name="header")
      .title.px-3
        v-avatar.mr-2(color="blue-grey lighten-4")
          v-icon {{ ResourceIcons[modelType.toUpperCase()] }}
        span {{ model.name }}

  slot(name="dropzone")
    .dropzone-wrapper(
        v-if="!files.length", :class="dropzoneClass", @dragenter="dropzoneClass = 'animate'",
        @dragleave="dropzoneClass = null", @drop="dropzoneClass = null")
      .dropzone-message
        v-icon(size="50px") attach_file
        .title.mt-3 {{ dropzoneMessage }}
      input.file-input(type="file", :multiple="multiple", @change="updateFiles")

  .pb-2.px-3(v-show="files.length && !errorMessage")
    v-subheader(v-show="!uploading") {{ statusMessage }}

    v-btn(v-if="!uploading", color="warning", @click="$emit('clear')")
      v-icon.mr-1 close
      | Clear all
    v-btn(v-if="!uploading", color="success", @click="$emit('start')")
      v-icon.mr-1 play_arrow
      | Start upload

  div(v-if="errorMessage")
    v-alert(:value="true", type="error")
      span.mr-2 {{ errorMessage }}
      v-btn(v-if="!uploading", color="teal lighten-1", dark, @click="$emit('resume')")
        v-icon.mr-1 replay
        | Resume upload

  slot(name="progress")
    div(v-if="uploading")
      .subheading.px-3.
        {{ formatDataSize(totalProgress) }} / {{ formatDataSize(totalSize) }}
        ({{ totalProgressPercent }}%)
      v-progress-linear(:value="totalProgressPercent", height="20")

  slot(name="files")
    v-list.file-list.pb-4(v-show="files.length", dense)
      v-list-tile.file-tile(v-for="(file, i) in files", :key="file.file.name", avatar,
          :class="`status-${file.status}`")
        v-list-tile-avatar
          v-btn.mx-0(v-if="file.status === 'pending'", icon, @click="$emit('removeFile', i)")
            v-icon close
          v-progress-circular(v-if="file.status === 'uploading'", color="primary", :rotate="-90",
              :value="progressPercent(file.progress)", :indeterminate="file.progress.indeterminate")
          v-icon(v-if="file.status === 'done'", color="success", large) check
          v-icon(v-if="file.status === 'error'", color="error", large) warning

        v-list-tile-content
          v-list-tile-title {{ file.file.name }}
          v-list-tile-sub-title
            span(v-if="file.progress.current") {{ formatDataSize(file.progress.current ) }} /&nbsp;
            span {{ formatDataSize(file.file.size) }}
</template>

<script>
import { sizeFormatter } from '../utils/mixins';
import { ResourceIcons } from '../constants';

export default {
  mixins: [sizeFormatter],
  props: {
    errorMessage: {
      default: null,
      type: String,
    },
    files: {
      default: () => [],
      type: Array,
    },
    model: {
      required: true,
      type: Object,
    },
    multiple: {
      default: true,
      type: Boolean,
    },
    uploading: {
      default: false,
      type: Boolean,
    },
  },
  data: () => ({
    dragover: false,
    dropzoneClass: null,
    ResourceIcons,
  }),
  computed: {
    dropzoneMessage() {
      if (this.multiple) {
        return 'Drag files here or click to select them';
      }
      return 'Drag a file here or click to select one';
    },
    modelType() {
      return this.model._modelType;
    },
    statusMessage() {
      return `${this.files.length} selected (${this.formatDataSize(this.totalSize)} total)`;
    },
    totalProgress() {
      return this.files.reduce((v, f) => v + (f.progress.current || 0), 0);
    },
    totalSize() {
      return this.files.reduce((v, f) => v + f.file.size, 0);
    },
    totalProgressPercent() {
      return this.progressPercent({
        current: this.totalProgress,
        total: this.totalSize,
      });
    },
  },
  methods: {
    progressPercent(progress) {
      if (!progress.total) {
        return 0;
      }
      return Math.round((100 * (progress.current || 0)) / progress.total);
    },
    updateFiles({ target }) {
      this.$emit('filesChanged', target.files);
    },
  },
};
</script>

<style lang="stylus">
$stripeColor = #f0f0f3
$img = linear-gradient(
  -45deg, $stripeColor 25%, transparent 25%, transparent 50%, $stripeColor 50%,
  $stripeColor 75%, transparent 75%, transparent)

.dropzone-wrapper
  position relative
  cursor pointer
  min-height 260px
  height 100%
  text-align center
  background-color #f6f6f9
  background-repeat repeat
  background-size 30px 30px

  &:hover
    background-image $img

  &.animate
    animation stripes 2s linear infinite
    background-image $img

  .file-input
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    height 100%
    width 100%
    opacity 0
    z-index 1
    cursor pointer

@keyframes stripes
  from
    background-position 0 0
  to
    background-position 30px 60px

.dropzone-message
  position relative
  top 50%
  transform translateY(-50%)

.file-tile
  transition width 1s ease-in-out, height 1s ease-in-out
  transition-delay 1s
  width 100%
  height 100%

  &.status-uploading
    background-color #fef4c9

  &.status-done
    width 0
    height 0
    overflow hidden
</style>
