/**
 * Since created() hooks are only triggered if the route component itself changes,
 * routes with params can use this mixin to automatically add a watch to route changes.
 * Containers that use this mixin must expose a "fetch" method that fetches their data.
 */
export const reusableRoute = {
  created () {
    this.fetch()
  },
  watch: {
    $route () {
      this.fetch()
    }
  }
}
