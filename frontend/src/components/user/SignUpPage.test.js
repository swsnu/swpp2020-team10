import axios from 'axios';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { SignUpPage } from './SignUpPage.js';
import { getMockStore } from '../../test-utils/mocks';


jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

const mockStore = getMockStore({});

describe('<SignUpPage />', () => {
  let component;

  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <Router>
          <SignUpPage />
        </Router>
      </Provider >
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(mount(component).length).toBe(1);
  });

  it('sets username on change', async () => {
    const value = 'username1';
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: 'trash' } });
    });
    wrapper.update();
  });

  it('sets password on change', async () => {
    const value = 'password1';

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#passwordInput').first().prop('onChange')({ target: { value } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#passwordInput').first().prop('onChange')({ target: { value: 'garbage' } });
    });
    wrapper.update();
  });

  it('rejects invalid username', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: 'user' } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: '' } });
    });
    wrapper.update();
  });

  it('rejects invalid password', () => {
    const wrapper = mount(component);
    wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: 'pass' } });
  });

  it('confirm password', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: 'pass' } });
      wrapper.find('#confirmPasswordInput').first().prop('onChange')({ target: { value: 'pa' } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#confirmPasswordInput').first().prop('onChange')({ target: { value: 'pass' } });
    });
    wrapper.update();
  });

  it('accepts valid sign up request', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve());

    const username = 'username1';
    const password = 'password1';

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: username } });
      wrapper.find('#passwordInput').first().prop('onChange')({ target: { value: password } });
      wrapper.find('#confirmPasswordInput').first().prop('onChange')({ target: { value: password } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#signupConfirmButton').first().simulate('click');
    });
    wrapper.update();
  });

  it('rejects username that already exists', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(() => Promise.reject({ response: { status: 409 } }));

    const username = 'username1';
    const password = 'password1';

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: username } });
      wrapper.find('#passwordInput').first().prop('onChange')({ target: { value: password } });
      wrapper.find('#confirmPasswordInput').first().prop('onChange')({ target: { value: password } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#signupConfirmButton').first().simulate('click');
    });
    wrapper.update();
  });

  it('rejects sign up request when error occurs', async () => {
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ response: { status: 444 } }));

    const username = 'username1';
    const password = 'password1';

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#usernameInput').first().prop('onChange')({ target: { value: username } });
      wrapper.find('#passwordInput').first().prop('onChange')({ target: { value: password } });
      wrapper.find('#confirmPasswordInput').first().prop('onChange')({ target: { value: password } });
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#signupConfirmButton').first().simulate('click');
    });
    wrapper.update();
  });

  it('sign in button', () => {
    const wrapper = mount(component);
    wrapper.find('#signinButton').first().prop('onClick')();
  });

});