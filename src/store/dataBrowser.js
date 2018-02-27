import _ from 'lodash';
import { downloadResources } from '@/utils/download';
import { accessLevelChecker } from '@/utils/mixins';

const { hasAdminAccess, hasWriteAccess } = accessLevelChecker.methods;

export default {
  namespaced: true,
  state: {
    actions: [],
    checkedActions: [{
      id: 'download',
      icon: 'file_download',
      text: 'Download',
      click: downloadResources,
    }, {
      id: 'cut',
      icon: 'content_cut',
      text: 'Cut',
      condition(checked) {
        return _.every(checked, (obj) => {
          if (obj._modelType === 'item') {
            return hasWriteAccess(this.model);
          }
          return hasWriteAccess(obj);
        });
      },
      click(checked) { console.log(checked); },
    }, {
      id: 'copy',
      icon: 'content_copy',
      text: 'Copy',
      condition() { return !!this.model; },
      click(checked) { console.log('copy clicked', checked); },
    }, {
      id: 'delete',
      icon: 'delete',
      text: 'Delete',
      condition(checked) {
        return _.every(checked, (obj) => {
          if (obj._modelType === 'item') {
            return hasWriteAccess(this.model);
          }
          return hasAdminAccess(obj);
        });
      },
      click(checked) {
        console.log(checked);
      },
    }],
  },
};
