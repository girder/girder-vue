<template lang="pug">
v-dialog(v-model="dialog", persistent, :max-width="width", @keydown.esc="$emit('cancel')")
  v-card(tile)
    v-card-text
      markdown(:text="markdown")
      v-text-field(v-if="requiredInput", v-model="input", :placeholder="requiredInput")
    v-card-actions
      v-spacer
      v-btn(@click="$emit('cancel')") {{ cancelText }}
      v-btn(:color="acceptColor", @click="$emit('accept')", :disabled="disableAccept")
        | {{ acceptText }}
</template>

<script>
import Markdown from './Markdown';

export default {
  components: { Markdown },
  props: {
    acceptColor: {
      default: 'primary',
      type: String,
    },
    acceptText: {
      default: 'Yes',
      type: String,
    },
    cancelText: {
      default: 'Cancel',
      type: String,
    },
    markdown: {
      default: 'Are you sure?',
      type: String,
    },
    requiredInput: {
      default: null,
      type: String,
    },
    width: {
      default: 550,
      type: Number,
    },
  },
  data: () => ({
    dialog: false,
    input: '',
  }),
  computed: {
    disableAccept() {
      return this.requiredInput && this.input !== this.requiredInput;
    },
  },
  methods: {
    show(val = true) {
      this.dialog = val;
      return this;
    },
  },
};
</script>
