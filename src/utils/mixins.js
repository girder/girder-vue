import { mapGetters } from 'vuex'

/**
 * This mixin should be used on any container component whose data needs to be
 * fetched on creation and also on user login/logout. Components using this mixin
 * must implement a ``fetch`` method.
 */
export const fetchingContainer = {
  computed: mapGetters('auth', ['isLoggedIn']),
  created () {
    this.fetch()
  },
  watch: {
    isLoggedIn () {
      this.fetch()
    }
  }
}

/**
 * Router components that wrap container components that should fetch data on route change
 * should mix this in, and add a "wrapped" ref to their container component.
 */
export const fetchingRoute = {
  watch: {
    $route () {
      this.$refs.wrapped.fetch()
    }
  }
}
