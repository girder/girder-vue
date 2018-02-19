<script>
import { sizeFormatter } from '@/utils/mixins';
import ResourceListContainer from './ResourceListContainer';

export default {
  extends: ResourceListContainer,
  mixins: [sizeFormatter],
  data: () => ({
    modelType: 'collection',
  }),
  computed: {
    canCreate() {
      // TODO base this on the actual setting by doing an API call
      return this.isLoggedIn;
    },
  },
  methods: {
    getSubtitle(collection) {
      return collection.size ? this.formatDataSize(collection.size) : 'No data';
    },
  },
};
</script>

