import Vue from 'vue';
import Confirm from '@/views/Confirm';

const ConfirmComponent = Vue.extend(Confirm);

/**
 * This utility wraps the Confirm view component into a Promise-based API. Calling it
 * will present the Confirm dialog to the user, and returns a Promise that will be resolved
 * when the user accepts or cancels the confirmation.
 * @param opts {Object} Options to pass as props to the Confirm component.
 * @param el {Element} DOM element that will contain the dialog.
 * @returns {Promise} A Promise that is always resolved, never rejected. If the user accepts the
 * confirmation, it's resolved with ``true``; if they cancel, it's resolved with ``false``.
 */
export default (opts = {}, el = document.querySelector('body')) => {
  const container = document.createElement('div');
  el.appendChild(container);

  const comp = new ConfirmComponent({
    el: container,
    propsData: opts,
  }).show();

  return new Promise((resolve) => {
    comp.$on('accept', () => {
      resolve(true);
      comp.show(false);
    });
    comp.$on('cancel', () => {
      resolve(false);
      comp.show(false);
    });
  }).finally(() => {
    comp.$destroy();
    container.remove();
  });
};
