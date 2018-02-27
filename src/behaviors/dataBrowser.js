import _ from 'lodash';
import store from '@/store';
import rest, { formEncode } from '@/rest';
import { downloadResources } from '@/utils/download';
import { accessLevelChecker } from '@/utils/mixins';

const { hasAdminAccess, hasWriteAccess } = accessLevelChecker.methods;

const buildResourceObject = (resources) => {
  const obj = {};
  resources.forEach((r) => {
    if (!obj.hasOwnProperty(r._modelType)) {
      obj[r._modelType] = [];
    }
    obj[r._modelType].push(r._id);
  });
  return obj;
};

export const actions = []; // TODO

/**
 * This is the list of actions that will be available under the checked actions menu of the
 * data browser. The ``condition`` function of each entry can be used to control visibility of
 * the action in the list. The ``execute`` function is what will get executed when the action
 * is clicked. The context of both of these functions will be the DataBrowserContainer component
 * from which they were called, and they are both passed the list of checked resources as
 * their argument.
 */
export const checkedActions = [{
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
  execute(checked) { console.log(checked); },
}, {
  id: 'copy',
  icon: 'content_copy',
  text: 'Copy',
  condition() { return !!this.model; },
  execute(checked) { console.log('copy clicked', checked); },
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
  execute(checked) {
    // TODO get confirmation from user
    this.fetching = true;

    rest.delete('/resource', {
      data: formEncode({
        resources: JSON.stringify(buildResourceObject(checked)),
        progress: true,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(() => {
      this.fetch();
      store.dispatch('toast/showToast', {
        text: `Deleted ${checked.length} resource${checked.length === 1 ? '' : 's'}`,
        icon: 'check',
      });
    }).catch(() => {
      store.dispatch('toast/showToast', {
        text: 'Resource deletion failed, see console for details.',
        icon: 'error',
        color: 'error',
      });
      this.fetching = false;
    });
  },
}];
