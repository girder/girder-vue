import { mapGetters } from 'vuex'
import { AccessType } from '@/constants'

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

/**
 * This mixin exposes helper methods for components that need to check that the current user has
 * a certain access level on a given resource.
 */
export const accessLevelChecker = {
  methods: {
    hasWriteAccess: (resource) => resource._accessLevel >= AccessType.WRITE,
    hasAdminAccess: (resource) => resource._accessLevel >= AccessType.ADMIN
  }
}
