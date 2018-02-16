import Vue from 'vue';
import { mapGetters } from 'vuex';
import { AccessType } from '@/constants';

/**
 * This mixin should be used on any container component whose data needs to be
 * fetched on initialization and also on user login/logout. Components using this mixin
 * must implement a ``fetch`` method.
 */
export const fetchingContainer = {
  computed: mapGetters('auth', ['isLoggedIn']),
  // Use mounted hook instead of created so that $refs is available in fetch()
  mounted() {
    this.fetch();
  },
  watch: {
    isLoggedIn() {
      this.fetch();
    },
  },
};

/**
 * Router components that wrap container components that should fetch data on route change
 * should mix this in, and add a "wrapped" ref to their container component.
 */
export const fetchingRoute = {
  watch: {
    $route() {
      // This watch callback gets triggered before the data gets flowed down to child components,
      // so we need to wait until the next tick to fetch.
      Vue.nextTick().then(() => {
        this.$refs.wrapped.fetch();
      });
    },
  },
};

/**
 * This mixin exposes helper methods for components that need to check that the current user has
 * a certain access level on a given resource.
 */
export const accessLevelChecker = {
  methods: {
    hasWriteAccess: resource => resource._accessLevel >= AccessType.WRITE,
    hasAdminAccess: resource => resource._accessLevel >= AccessType.ADMIN,
  },
};
