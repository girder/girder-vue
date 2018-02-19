<template lang="pug">
v-text-field(v-model="text", prepend-icon="search", :placeholder="placeholder", clearable,
    :loading="loading ? 'teal': false")
</template>

<script>
export default {
  model: {
    prop: 'query',
    event: 'change',
  },
  props: {
    loading: {
      default: false,
      type: Boolean,
    },
    placeholder: {
      default: 'Search',
      type: String,
    },
    query: {
      default: '',
      type: String,
    },
  },
  data: () => ({
    text: '',
  }),
  watch: {
    text() {
      this.$emit('change', this.text);
    },
  },
};
</script>
