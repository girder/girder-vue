<template lang="pug">
component(:is="viewComponent", @login="doLogin", :error-message="errorMessage")
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  props: {
    viewComponent: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    errorMessage: ''
  }),
  methods: {
    doLogin (credentials) {
      this.errorMessage = ''
      this.login(credentials).then(() => {
        this.hideDialog()
      }).catch(({response}) => {
        this.errorMessage = response.data.message
      })
    },
    ...mapActions('auth', ['login']),
    ...mapMutations('dialog', ['hideDialog'])
  }
}
</script>
