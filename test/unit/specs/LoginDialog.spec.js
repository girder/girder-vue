import { mount } from '@vue/test-utils';
import LoginForm from '@/views/LoginForm';

describe('Login dialog', () => {
  it('should render correct contents', () => {
    const wrapper = mount(LoginForm, {
      propsData: {
        errorMessage: 'An error message',
      },
    });
    wrapper.vm.$el.querySelector('.err-msg').textContent.should.equal('An error message');
  });
});
