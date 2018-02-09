<template lang="pug">
div
  h2 Collections
  button(@click="showCreateDialog = true") Create new
  ul
    li(v-for="collection in collections")
      router-link(:to="`collection/${collection._id}`") {{ collection.name }}
      .description {{ collection.description }}
  modal(v-if="showCreateDialog", @close="showCreateDialog = false")
    div(slot="header") Create new collection
    div(slot="body")
      form(@submit.prevent="create")
        input(v-model="newCollection.name", placeholder="Enter name")
        input(v-model="newCollection.description", placeholder="Enter description (optional)")
        input(type="submit", style="display: none;")
      .err-msg(v-if="createFailedMessage") {{ createFailedMessage }}
    div(slot="footer")
      button(@click="create") Create
</template>

<script>
import Modal from './Modal'

export default {
  components: { Modal },
  data () {
    return {
      newCollection: {
        name: '',
        description: ''
      },
    createFailedMessage: null,
    showCreateDialog: this.createDialog
    }
  },
  methods: {
    create () {
      this.$emit('create', this.newCollection)
    }
  },
  props: {
    collections: {
      default: () => [],
      type: Array
    },
    createDialog: {
      default: false,
      type: Boolean
    }
  }
}
</script>
