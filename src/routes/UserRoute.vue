<template lang="pug">
user-container(ref="wrapped", :id="$route.params.id", @destroyed="$router.push('/users')")
</template>

<script>
import { fetchingRoute } from '@/utils/mixins';
import UserContainer from '../containers/UserContainer';

export default {
  components: { UserContainer },
  mixins: [fetchingRoute],
};
</script>
