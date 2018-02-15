<template lang="pug">
collections-container(@created="(data) => $router.push(`/collection/${data._id}`)")
</template>

<script>
import CollectionsContainer from '../containers/CollectionsContainer'

export default {
  components: { CollectionsContainer }
}
</script>
