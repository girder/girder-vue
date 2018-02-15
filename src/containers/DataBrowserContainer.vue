<template lang="pug">
data-browser(ref="view" :model="model", :model-type="modelType", :breadcrumbs="breadcrumbs",
    :items="items", :folders="folders", :fetching="fetching")
</template>

<script>
import rest from '../rest'
import { fetchingContainer } from '../utils/mixins'
import DataBrowser from '../views/DataBrowser'

export default {
  components: { DataBrowser },
  mixins: [fetchingContainer],
  props: {
    model: {
      required: true,
      type: Object
    },
    modelType: {
      default: 'folder',
      type: String
    }
  },
  data: () => ({
    breadcrumbs: [],
    items: [],
    folders: [],
    fetching: false,
  }),
  methods: {
    fetch () {
      this.fetching = true
      this.items = []
      this.folders = []
      this.breadcrumbs = [{
        type: this.modelType,
        object: this.model
      }]

      const requests = [rest.get('/folder', {
        params: {
          parentId: this.model._id,
          parentType: this.modelType
        }
      }).then(({data}) => {
        this.folders = data
      })]

      if (this.modelType === 'folder') {
        const fetchItems = rest.get('/item', {
          params: {
            folderId: this.model._id
          }
        }).then(({data}) => {
          this.items = data
        })

        const fetchRootPath = rest.get(`/folder/${this.model._id}/rootpath`).then(({data}) => {
          this.breadcrumbs = data.concat(this.breadcrumbs)
        })

        requests.push(fetchItems, fetchRootPath)
      }

      Promise.all(requests).finally(() => {
        this.fetching = false
      })
    }
  }
}
</script>
