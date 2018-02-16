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
  slot(name="error")
    v-alert(v-if="errorMessage", type="error") {{ errorMessage }}
  slot(name="dropzone")
    .dropzone-wrapper(
        v-if="!files.length", :class="dropzoneClass", @dragenter="dropzoneClass = 'animate'",
        @dragleave="dropzoneClass = null", @drop="dropzoneClass = null")
      .dropzone-message
        v-icon(size="50px") attach_file
        .title.mt-3 {{ dropzoneMessage }}
      input.file-input(type="file", :multiple="multiple", @change="updateFiles")
  slot(name="files")
    v-list(v-if="files.length")
</template>

<script>
import { ResourceIcons } from '../constants';

export default {
  props: {
    errorMessage: {
      default: null,
      type: String,
    },
    model: {
      required: true,
      type: Object,
    },
    multiple: {
      default: true,
      type: Boolean,
    },
  },
  data: () => ({
    dragover: false,
    dropzoneClass: null,
    files: [],
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
  },
  methods: {
    updateFiles({ target }) {
      if (this.multiple) {
        this.files = target.files;
      } else {
        this.files = target.files.slice(0, 1);
      }
      this.$emit('filesChanged', this.files);
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
</style>
