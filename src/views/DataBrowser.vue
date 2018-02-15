<template lang="pug">
div
  v-toolbar.top-toolbar(dense, dark, flat, color="blue-grey darken-2")
    v-breadcrumbs.ml-0
      v-icon(slot="divider") keyboard_arrow_right
      v-breadcrumbs-item(v-for="crumb in breadcrumbData", :key="crumb.object._id", :to="crumb.to")
        v-icon {{ crumb.icon }}
        span.ml-1 {{ crumb.title }}
    v-spacer
    v-btn(v-if="breadcrumbs.length > 1", icon, @click="$emit('up')")
      v-icon arrow_upward
  v-toolbar(v-if="showActions", dense, flat, color="blue-grey lighten-4")
    v-spacer
    v-btn(v-if="hasWriteAccess(model)", icon, color="success")
      v-icon file_upload
    v-btn(v-if="hasAdminAccess(model)", icon, color="warning")
      v-icon lock_outline
    v-btn(icon, flat)
      v-icon menu
</template>

<script>
import { ResourceIcons } from '@/constants'
import { accessLevelChecker } from '@/utils/mixins'

export default {
  mixins: [accessLevelChecker],
  props: {
    fetching: {
      default: false,
      type: Boolean
    },
    model: {
      required: true,
      type: Object
    },
    modelType: {
      default: 'folder',
      type: String
    },
    breadcrumbs: {
      default: null,
      type: Array
    },
    folders: {
      default: () => [],
      type: Array
    },
    items: {
      default: () => [],
      type: Array
    },
    showActions: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    breadcrumbData () {
      return this.breadcrumbs.map((crumb) => ({
        title: crumb.object.name || crumb.object.login,
        to: `/${crumb.type}/${crumb.object._id}`,
        icon: ResourceIcons[crumb.type.toUpperCase()],
        ...crumb
      }))
    }
  }
}
</script>
