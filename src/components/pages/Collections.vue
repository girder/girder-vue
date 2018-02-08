<template lang="pug">
div
  h2 Collections
  ul
    li(v-for="collection in collections")
      router-link(:to="`collection/${collection._id}`") {{ collection.name }}
</template>

<script>
import rest from '@/rest'

export default {
  data () {
    return {
      collections: []
    }
  },
  created () {
    rest.get('/collection').then(({data}) => {
      this.collections = data
    })
  }
}
</script>
