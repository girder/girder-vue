<template lang="pug">
  collections(:collections="collections")
</template>

<script>
import rest from '@/rest'
import Collections from '../views/Collections'

export default {
  components: {
    Collections
  },
  created() {
    rest.get('/collection').then(({data}) => {
      this.collections = data
    })
  },
  data() {
    return {
      collections: []
    }
  },
}
</script>

