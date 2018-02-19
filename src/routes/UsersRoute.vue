<template lang="pug">
users-container(@created="(data) => $router.push(`/user/${data._id}`)")
</template>

<script>
import UsersContainer from '../containers/UsersContainer';

export default {
  components: { UsersContainer },
};
</script>
