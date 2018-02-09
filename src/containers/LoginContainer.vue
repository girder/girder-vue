<template lang="pug">
login-dialog(@login="doLogin", :error-message="errorMessage")
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import LoginDialog from '../views/LoginDialog'

export default {
  components: { LoginDialog },
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
