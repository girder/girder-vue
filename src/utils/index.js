import { fetchingContainer } from './mixins'

/**
 * Containers that are only responsible for fetching data for a presentation component
 * can use this helper. This uses the ``fetchingContainer`` mixin to make sure data is
 * re-fetched any time the user logs in
 * @param component {Object} The component type to use
 * @param data {Object} The initial data state.
 * @param fetch {Function} The fetch method.
 * @returns {{components: {Presentation: *}, data: function(): {data: *}, methods: {fetch: *}, mixins: *[], template: string}}
 */
export const createFetchContainer = ({component, data, fetch}) => {
  return {
  components: {Presentation: component},
  data: () => ({data}),
  methods: { fetch },
  mixins: [fetchingContainer],
  template: '<Presentation v-bind="data" />'
}}
