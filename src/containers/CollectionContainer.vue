<template lang="pug">
collection(:collection="collection", @destroy="destroy")
</template>

<script>
import { mapActions } from 'vuex'
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
      rest.delete(`/collection/${this.id}`).then(() => {
        this.$router.push('/collections')
        this.showToast({
          text: 'Collection deleted'
        })
      })
    },
    fetch () {
      rest.get(`/collection/${this.id}`).then(({data}) => {
        this.collection = data
      })
    },
    ...mapActions('toast', ['showToast'])
  },
  props: ['id']
}
</script>

