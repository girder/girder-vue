import Vue from 'vue';
import { mapGetters } from 'vuex';
import { AccessType } from '@/constants';

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
 * Containers that must fetch lists of data in pages should use this mixin. The container is
 * responsible for calling "transformDataPage" on the returned list, which will automatically
 * update the "hasNextPage" data field and remove the last document from the list if necessary.
 * The original Array passed to "transformDataPage" is not modified; a shallow copy is returned
 * in the case when it requires modification.
 */
export const pagingContainer = {
  props: {
    pageSize: {
      default: 30,
      type: Number,
    },
  },
  data: () => ({
    pageOffset: 0,
    hasNextPage: false,
  }),
  computed: {
    hasPrevPage() {
      return this.pageOffset > 0;
    },
    currentPage() {
      return this.pageOffset / this.pageSize;
    },
    pagingParams() {
      return {
        limit: this.pageSize + 1,
        offset: this.pageOffset,
      };
    },
  },
  methods: {
    fetchNextPage() {
      this.pageOffset += this.pageSize;
      return this.fetch();
    },
    fetchPrevPage() {
      this.pageOffset = Math.max(0, this.pageOffset - this.pageSize);
      return this.fetch();
    },
    fetchPage(n) {
      this.pageOffset = this.pageSize * n;
      return this.fetch();
    },
    transformDataPage(list) {
      this.hasNextPage = list.length > this.pageSize;
      if (this.hasNextPage) {
        return list.slice(0, -1);
      }
      return list;
    },
  },
};

/**
 * Any view component that needs to display human-readable data sizes should use this.
 */
export const sizeFormatter = {
  methods: {
    formatDataSize(size) {
      if (size < 1024) {
        return `${size} B`;
      }

      let i;
      for (i = 0; size >= 1024; i += 1) {
        size /= 1024;
      }

      return `${size.toFixed(2)}  ${['B', 'KB', 'MB', 'GB', 'TB'][Math.min(i, 4)]}`;
    },
  },
};

/**
 * Container components that need to expose slots from their child components should use this.
 * It exposes a special property "view-slots" that parents can set to indicate which of the
 * view slots are being overridden. This should be an Array of strings for named slots, or
 * for the default slot, use ``null`` instead of a string.
 */
export const viewSlotWrapper = {
  props: {
    viewSlots: {
      default: () => [],
      type: Array,
    },
  },
};
