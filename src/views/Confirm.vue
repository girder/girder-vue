<template lang="pug">
v-dialog(v-model="dialog", persistent, :max-width="width", @keydown.esc="cancel")
  v-card(tile)
    v-card-text {{ message }}
    v-card-actions
      v-spacer
      v-btn(@click="cancel") {{ cancelText }}
      v-btn(:color="acceptColor", @click="accept") {{ acceptText }}
</template>

<script>
export default {
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
    message: {
      default: 'Are you sure?',
      type: String,
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
      this.$emit('accept');
    },
    cancel() {
      this.$emit('cancel');
    },
    show(val = true) {
      this.dialog = val;
      return this;
    },
  },
};
</script>
