<template lang="pug">
v-card
  v-card-title
    h3.headline Create new folder
  v-form(@submit.prevent="create")
    v-card-text
      v-text-field(v-model="name", label="Name", :error-messages="listify(errors.name)")
      v-text-field(v-model="description", label="Description", hint="Optional", multi-line)
    v-card-actions
      v-btn(type="submit", color="primary", :loading="loading") Create
</template>

<script>
export default {
  props: {
    errors: {
      default: null,
      type: Object,
    },
    loading: {
      default: false,
      type: Boolean,
    },
  },
  data: () => ({
    description: '',
    name: '',
  }),
  methods: {
    create() {
      this.$emit('create', {
        description: this.description,
        name: this.name,
      });
    },
    reset() {
      this.description = '';
      this.name = '';
    },
    listify: v => (v ? [v] : []),
  },
};
</script>
