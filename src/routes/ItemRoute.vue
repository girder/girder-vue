<template lang="pug">
item-container(ref="wrapped", :id="$route.params.id", @destroyed="goToParent")
</template>

<script>
import { fetchingRoute } from '@/utils/mixins';
import ItemContainer from '@/containers/ItemContainer';

export default {
  components: { ItemContainer },
  mixins: [fetchingRoute],
  methods: {
    goToParent(item) {
      this.$router.push(`/folder/${item.folderId}`);
    },
  },
};
</script>
