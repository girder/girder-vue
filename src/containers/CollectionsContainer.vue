<template lang="pug">
collections(:collections="collections", @create="create")
</template>

<script>
import rest, { formEncode } from '@/rest'
import { fetchingContainer } from '@/utils/mixins'
import Collections from '../views/Collections'

export default {
  mixins: [fetchingContainer],
  components: { Collections },
  data: () => ({
    collections: []
  }),
  methods: {
    create (obj) {
      rest.post('/collection', formEncode(obj)).then(({data}) => {
        this.$router.push(`/collection/${data._id}`)
      })
    },
    fetch () {
      rest.get('/collection').then(({data}) => {
        this.collections = data
      })
    }
  }
}
</script>

