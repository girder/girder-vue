<template lang="pug">
div
  slot
    user(v-if="user", :user="user", @destroy="destroy")
</template>

<script>
import { mapActions } from 'vuex';
import rest from '@/rest';
import { fetchingContainer } from '@/utils/mixins';
import User from '../views/User';

export default {
  components: { User },
  mixins: [fetchingContainer],
  props: {
    id: {
      default: null,
      type: String,
    },
  },
  data: () => ({
    user: null,
  }),
  methods: {
    destroy() {
      return rest.delete(`/user/${this.id}`).then(() => {
        this.user = null;
        this.showToast({
          text: 'User deleted',
        });
        this.$emit('destroyed');
      });
    },
    fetch() {
      return rest.get(`/user/${this.id}`).then(({ data }) => {
        this.user = data;
      });
    },
    ...mapActions('toast', ['showToast']),
  },
};
</script>
