import { mount } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';

import { SignUpPage } from './SignUpPage';


const mockStore = createStore(state => state);

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));


describe('<SignUpPage />', () => {
  let component;

  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <SignUpPage />
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(mount(component).length).toBe(1);
  });

  it('sets username on change', () => {
    const value = 'username1';
    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value } });
    expect(wrapper.find('#usernameInput').prop('value')).toBe(value);
  });

  it('sets password on change', () => {
    const value = 'password1';
    const wrapper = mount(component);
    wrapper.find('#passwordInput').simulate('change', { target: { value } });
    expect(wrapper.find('#passwordInput').prop('value')).toBe(value);
  });

  it('sets email on change', () => {
    const value = 'email1';
    const wrapper = mount(component);
    wrapper.find('#emailInput').simulate('change', { target: { value } });
    expect(wrapper.find('#emailInput').prop('value')).toBe(value);
  });

  it('rejects invalid username', () => {

    const value = 'user name';
    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value } });
    wrapper.find('#signupConfirmButton').first().simulate('click');
  });

  it('rejects invalid password', () => {

    const username = 'username1';
    const password = 'pass word';
    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value: username } });
    wrapper.find('#passwordInput').simulate('change', { target: { value: password } });
    wrapper.find('#signupConfirmButton').first().simulate('click');
  });

  it('accepts valid sign up request', async () => {
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve());

    const username = 'username1';
    const password = 'password1';
    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value: username } });
    wrapper.find('#passwordInput').simulate('change', { target: { value: password } });
    wrapper.find('#signupConfirmButton').first().simulate('click');
    await Promise.resolve();
    expect(mockHistoryPush).toBeCalledWith('/');
  });

  it('rejects username that already exists', async () => {
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ response: { status: 409 } }));

    const username = 'username1';
    const password = 'password1';
    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value: username } });
    wrapper.find('#passwordInput').simulate('change', { target: { value: password } });
    wrapper.find('#signupConfirmButton').first().simulate('click');
    await Promise.resolve();
  });

  it('rejects sign up request when error occurs', async () => {
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ response: { status: 444 } }));

    const username = 'username1';
    const password = 'password1';
    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value: username } });
    wrapper.find('#passwordInput').simulate('change', { target: { value: password } });
    wrapper.find('#signupConfirmButton').first().simulate('click');
    await Promise.resolve();
  });

});