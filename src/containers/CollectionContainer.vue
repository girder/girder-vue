<template lang="pug">
collection(:collection="collection")
</template>

<script>
import rest from '@/rest'
import { fetchingContainer } from '@/utils/mixins'
import Collection from '../views/Collection'

export default {
  mixins: [fetchingContainer],
  components: { Collection },
  data: () => ({
    collection: {}
  }),
  methods: {
    destroy () {
      rest.delete(`/collection/${this.id}`)
    },
    fetch () {
      rest.get(`/collection/${this.id}`).then(({data}) => {
        this.collection = data
      })
    }
  },
  props: ['id']
}
</script>

