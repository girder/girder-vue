<script>
import { mapGetters } from 'vuex';
import { sizeFormatter } from '@/utils/mixins';
import ResourceListContainer from './ResourceListContainer';

export default {
  extends: ResourceListContainer,
  mixins: [sizeFormatter],
  data: () => ({
    modelType: 'user',
  }),
  computed: {
    canCreate() {
      return this.isAdmin;
    },
    ...mapGetters('auth', ['isAdmin']),
  },
  methods: {
    getSubtitle(user) {
      const size = user.size ? this.formatDataSize(user.size) : 'No data';
      return `${user.firstName} ${user.lastName} - ${size}`;
    },
    getTitle(user) {
      return user.login;
    },
  },
};
</script>

