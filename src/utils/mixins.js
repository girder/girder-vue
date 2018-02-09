import { mapGetters } from 'vuex'

/**
 * This mixin should be used on any container component whose data needs to be
 * fetched on creation, on route parameter change, and on user login/logout.
 * Components using this mixin must implement a ``fetch`` method.
 */
export const fetchingContainer = {
  computed: mapGetters('auth', ['isLoggedIn']),
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      throw 'Your component should have a fetch() method when using fetchingContainer mixin.'
    }
  },
  watch: {
    $route () {
      this.fetch()
    },
    isLoggedIn () {
      this.fetch()
    }
  }
}
