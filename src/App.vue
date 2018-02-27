<template lang="pug">
#app
  router-view
  v-dialog(max-width="500px", v-model="showAuthDialog", @keydown.esc="showAuthDialog = false")
    auth-container(@login="showAuthDialog = false", @register="showAuthDialog = false")
  v-snackbar(v-for="(toast, i) in toasts", :key="i", :value="true", :timeout="null"
      :color="toast.color", right, bottom)
    v-icon.mr-2(v-if="toast.icon") {{ toast.icon }}
    span {{ toast.text }}
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import AuthContainer from './containers/AuthContainer';

export default {
  components: {
    AuthContainer,
  },
  data() {
    return {
      showAuthDialog: this.authDialogVisible,
    };
  },
  computed: {
    ...mapState('auth', ['authDialogMode', 'authDialogVisible']),
    ...mapState('toast', ['toasts']),
  },
  watch: {
    authDialogVisible(val) {
      this.showAuthDialog = val;
    },
    showAuthDialog(val) {
      this.setAuthDialogVisible(val);
    },
  },
  methods: mapMutations('auth', ['setAuthDialogMode', 'setAuthDialogVisible']),
};
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
</style>
