<template lang="pug">
collection-container(ref="wrapped", :id="$route.params.id", @destroyed="$router.push('/collections')")
</template>

<script>
import { fetchingRoute } from '@/utils/mixins';
import CollectionContainer from '../containers/CollectionContainer';

export default {
  components: { CollectionContainer },
  mixins: [fetchingRoute],
};
</script>
