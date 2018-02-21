<template lang="pug">
div
  slot
    create-folder(:errors="errors", :loading="loading", @create="create", ref="view")
</template>

<script>
import rest, { formEncode } from '@/rest';
import CreateFolder from '../views/CreateFolder';

const emptyErrors = () => ({
  name: null,
  NONE: null,
});

export default {
  components: { CreateFolder },
  props: {
    parent: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    errors: emptyErrors(),
    loading: false,
  }),
  methods: {
    create({ name, description }) {
      this.loading = true;
      this.errors = emptyErrors();

      rest.post('/folder', formEncode({
        name,
        description,
        parentId: this.parent._id,
        parentType: this.parent._modelType,
      })).then(({ data }) => {
        this.$refs.view.reset();
        this.$emit('created', { folder: data });
      }).catch(({ response }) => {
        if (response) {
          this.errors[response.data.field || 'NONE'] = response.data.message;
        } else {
          this.errors.NONE = 'Could not connect to server.';
        }
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
