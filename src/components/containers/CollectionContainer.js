import rest from '@/rest'
import { createFetchContainer } from '@/utils'
import Collection from '../views/Collection'

export default createFetchContainer({
  component: Collection,
  data: {
    collection: {}
  },
  fetch () {
    rest.get(`/collection/${this.$route.params.id}`).then(({data}) => {
      this.collection = data
    })
  },
  name: 'CollectionContainer'
})
