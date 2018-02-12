import { mount } from '@vue/test-utils'
import LoginDialog from '@/views/LoginDialog'

describe('Login dialog', () => {
  it('should render correct contents', () => {
    const wrapper = mount(LoginDialog, {
      propsData: {
        errorMessage: 'An error message'
      }
    })
    wrapper.vm.$el.querySelector('.err-msg').textContent.should.equal('An error message')
  })
})
