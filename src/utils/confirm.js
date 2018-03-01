import Vue from 'vue';
import Confirm from '@/views/Confirm';

const ConfirmComponent = Vue.extend(Confirm);

export default (opts, el = document.querySelector('body')) => {
  const container = document.createElement('div');
  el.appendChild(container);

  let comp;
  return new Promise((resolve) => {
    comp = new ConfirmComponent({
      el: container,
      propsData: {
        resolve,
        ...opts,
      },
    }).show();
  }).finally(() => {
    comp.$destroy();
    container.remove();
  });
};
