<template lang="pug">
v-tabs.md-tab(v-model="activeTab", color="blue-grey lighten-4", slider-color="blue-grey darken-1")
  v-tab Markdown
  v-tab-item
    v-text-field.pt-0.md-input(v-model="text_", :placeholder="placeholder", multi-line, solo)
  v-tab Preview
  v-tab-item.md-preview.pa-2
    markdown(:text="text_")
</template>

<script>
import Markdown from './Markdown';

export default {
  components: { Markdown },
  model: {
    prop: 'text',
    event: 'changed',
  },
  props: {
    placeholder: {
      default: null,
      type: String,
    },
    text: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      activeTab: 0,
      text_: this.text,
    };
  },
  watch: {
    text() {
      this.text_ = this.text;
    },
    text_() {
      this.$emit('changed', this.text_);
    },
  },
};
</script>

<style lang="stylus" scoped>
.md-tab
  border 1px solid #e1e1e4

.md-preview
  min-height 140px

.md-input
  background-color #f5f5f8 !important
  &.input-group--focused
    background-color white !important
</style>
