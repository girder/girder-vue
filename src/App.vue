<template lang="pug">
#app
  router-view
  v-dialog(max-width="500px", v-model="showingAuthDialog", @keydown.esc="showingAuthDialog = false")
    auth-container(@login="showingAuthDialog = false", @register="showingAuthDialog = false")
  v-snackbar(v-for="(toast, i) in toasts", :key="i", :value="true", :timeout="null"
      :color="toast.color", right, bottom)
    v-icon.mr-2(v-if="toast.icon") {{ toast.icon }}
    span {{ toast.text }}
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AuthContainer from './containers/AuthContainer';

export default {
  components: {
    AuthContainer,
  },
  data() {
    return {
      showingAuthDialog: this.authDialogVisible,
    };
  },
  computed: {
    ...mapState('auth', ['authDialogMode', 'authDialogVisible']),
    ...mapState('toast', ['toasts']),
  },
  watch: {
    authDialogVisible(val) {
      this.showingAuthDialog = val;
    },
    showingAuthDialog(val) {
      this.showAuthDialog({ visible: val });
    },
  },
  methods: mapActions('auth', ['showAuthDialog']),
};
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
</style>
