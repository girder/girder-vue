<template lang="pug">
resource-list(:models="collections", model-type="collection", :can-create="canCreate",
    :subtitle="subtitle")
</template>

<script>
import { mapGetters } from 'vuex';
import rest, { formEncode } from '@/rest';
import { fetchingContainer, sizeFormatter } from '@/utils/mixins';
import ResourceList from '../views/ResourceList';

export default {
  components: { ResourceList },
  mixins: [fetchingContainer, sizeFormatter],
  data: () => ({
    collections: [],
  }),
  computed: {
    canCreate() {
      // TODO base this on the actual setting by doing an API call
      return this.isLoggedIn;
    },
    ...mapGetters('auth', ['isLoggedIn']),
  },
  methods: {
    create(obj) {
      rest.post('/collection', formEncode(obj)).then(({ data }) => {
        this.$emit('created', data);
      });
    },
    fetch() {
      rest.get('/collection').then(({ data }) => {
        this.collections = data;
      });
    },
    subtitle(collection) {
      return collection.size ? this.formatDataSize(collection.size) : 'No data';
    },
  },
};
</script>

