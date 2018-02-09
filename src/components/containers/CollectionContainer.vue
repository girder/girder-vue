<template lang="pug">
  collection(:collection="collection")
</template>

<script>
import rest from '@/rest'
import { reusableRoute } from '@/utils/mixins'
import Collection from '../views/Collection'

export default {
  mixins: [reusableRoute],
  components: {
    Collection
  },
  data() {
    return {
      collection: {}
    }
  },
  methods: {
    fetch () {
      rest.get(`/collection/${this.$route.params.id}`).then(({data}) => {
        this.collection = data
      })
    }
  }
}
</script>

