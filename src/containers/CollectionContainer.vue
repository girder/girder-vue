<template lang="pug">
collection(v-if="collection", :collection="collection", @destroy="destroy")
</template>

<script>
import { mapActions } from 'vuex'
import rest from '@/rest'
import { fetchingContainer } from '@/utils/mixins'
import Collection from '../views/Collection'

export default {
  components: { Collection },
  mixins: [fetchingContainer],
  props: {
    id: {
      default: null,
      type: String
    }
  },
  data: () => ({
    collection: null
  }),
  methods: {
    destroy () {
      rest.delete(`/collection/${this.id}`).then(() => {
        this.collection = null
        this.showToast({
          text: 'Collection deleted'
        })
        this.$emit('destroyed')
      })
    },
    fetch () {
      rest.get(`/collection/${this.id}`).then(({data}) => {
        this.collection = data
      })
    },
    ...mapActions('toast', ['showToast'])
  },
}
</script>
