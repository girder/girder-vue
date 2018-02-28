<template lang="pug">
v-dialog(v-model="dialog", persistent, :max-width="width", @keydown.esc="cancel")
  v-card(tile)
    v-card-text {{ message }}
    v-card-actions
      v-spacer
      v-btn(color="grey", @click="cancel") {{ cancelText }}
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
    promise: {
      default: null,
      type: Promise,
    },
    width: {
      default: 550,
      type: Number,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    accept() {
      this.promise.resolve();
      this.dialog = false;
    },
    cancel() {
      this.promise.reject();
      this.dialog = false;
    },
    show() {
      this.dialog = true;
    },
  },
};
</script>
