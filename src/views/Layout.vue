<template lang="pug">
v-app
  v-navigation-drawer(fixed, :clipped="$vuetify.breakpoint.mdAndUp", app, v-model="drawer")
    v-list(dense)
      v-list-tile(v-for="item in navItems", :key="item.id", v-if="isNavItemVisible(item)", :to="item.route")
        v-list-tile-action(v-if="item.icon")
          v-icon {{ item.icon }}
        v-list-tile-content
          v-list-tile-title {{ item.text }}
  v-toolbar(:color="toolbarColor", dark, app, :clipped-left="$vuetify.breakpoint.mdAndUp", fixed)
    v-toolbar-title.mr-4.ml-1
      v-toolbar-side-icon(@click.stop="drawer = !drawer")
      span.hidden-xs-only {{ title }}
    v-flex
      v-text-field.search(flat, solo-inverted, prepend-icon="search", label="Search...")
    v-spacer
    v-toolbar-items.mr-0(v-if="isLoggedIn")
      v-menu(offset-y)
        v-btn(slot="activator", flat)
          v-icon account_circle
          .no-tt.ml-2 {{ user.login }}
          v-icon arrow_drop_down
        v-list(dense)
          v-list-tile(:to="`/useraccount/${user._id}`")
            v-icon.mr-2 settings
            v-list-tile-title My account
          v-list-tile(@click="doLogout")
            v-icon.mr-2 exit_to_app
            v-list-tile-title Log out
    v-toolbar-items.mr-0(v-else)
      v-btn(flat, @click="showRegisterDialog") Register
      v-btn(flat, @click="showLoginDialog") Log in
  v-content
    v-container
      router-view
  v-footer(app)
    v-flex.text-xs-center
      a(:href="getApiUrl") Web API
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { getApiUrl } from '@/rest'
import { authDialogModes } from '@/store/auth'

export default {
  data: () => ({
    dialog: null,
    drawer: null
  }),
  computed: {
    getApiUrl,
    ...mapState('auth', ['user']),
    ...mapState('layout', ['navItems', 'title', 'toolbarColor']),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin'])
  },
  methods: {
    doLogout () {
      this.logout()
      this.$router.push({path: '/'})
    },
    isNavItemVisible (item) {
      if (item.requireAdmin === true) {
        return this.isAdmin
      }
      if (item.requireLogin === true) {
        return this.isLoggedIn
      }
      return true
    },
    showLoginDialog () {
      this.showAuthDialog({mode: authDialogModes.LOGIN})
    },
    showRegisterDialog () {
      this.showAuthDialog({mode: authDialogModes.REGISTER})
    },
    ...mapActions('auth', ['logout']),
    ...mapMutations('auth', ['showAuthDialog'])
  }
}
</script>

<style lang="stylus" scoped>
.no-tt
  text-transform none

.search
  max-width 300px
</style>
