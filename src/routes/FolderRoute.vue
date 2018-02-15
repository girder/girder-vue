<template lang="pug">
folder-container(ref="wrapped", :id="$route.params.id", @destroyed="goToParent")
</template>

<script>
import { fetchingRoute } from '@/utils/mixins'
import FolderContainer from '../containers/FolderContainer'

export default {
  components: { FolderContainer },
  mixins: [fetchingRoute],
  methods: {
    goToParent (folder) {
      this.$router.push(`/${folder.parentCollection}/${folder.parentId}`)
    }
  }
}
</script>
