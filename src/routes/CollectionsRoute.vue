<template lang="pug">
collections-container(@created="goToCollection")
</template>

<script>
import CollectionsContainer from '../containers/CollectionsContainer'

export default {
  components: { CollectionsContainer },
  methods: {
    goToCollection (data) {
      this.$router.push(`/collection/${data._id}`)
    }
  }
}
</script>
