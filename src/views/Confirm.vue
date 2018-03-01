<template lang="pug">
v-dialog(v-model="dialog", persistent, :max-width="width", @keydown.esc="cancel")
  v-card(tile)
    v-card-text {{ message }}
    v-card-actions
      v-spacer
      v-btn(@click="cancel") {{ cancelText }}
      v-btn(color="primary", @click="accept") {{ acceptText }}
</template>

<script>
export default {
  props: {
    acceptText: {
      default: 'Yes',
      type: String,
    },
    cancelText: {
      default: 'Cancel',
      type: String,
    },
    message: {
      default: 'Are you sure?',
      type: String,
    },
    resolve: {
      default: () => {},
      type: Function,
    },
    width: {
      default: 550,
      type: Number,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    accept() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
    show() {
      this.dialog = true;
      return this;
    },
  },
};
</script>
