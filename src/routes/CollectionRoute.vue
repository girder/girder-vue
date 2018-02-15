<template lang="pug">
collection-container(ref="wrapped", :id="id", @destroyed="goToCollections")
</template>

<script>
import { fetchingRoute } from '@/utils/mixins'
import CollectionContainer from '../containers/CollectionContainer'

export default {
  components: { CollectionContainer },
  mixins: [fetchingRoute],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    goToCollections (data) {
      this.$router.push(`/collections`)
    }
  }
}
</script>
