<template lang="pug">
  collections(:collections="collections")
</template>

<script>
import rest from '@/rest'
import { fetchingContainer } from '@/utils/mixins'
import Collections from '../views/Collections'

export default {
  mixins: [fetchingContainer],
  components: {
    Collections
  },
  data() {
    return {
      collections: []
    }
  },
  methods: {
    fetch () {
      rest.get('/collection').then(({data}) => {
        this.collections = data
      })
    }
  }
}
</script>

