import React from 'react';
import { mount } from 'enzyme';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { SignInPage } from './SignInPage.js';
import { getMockStore } from '../../test-utils/mocks';


jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('../../store/actions/index', () => ({
  signin: jest.fn(),
}));


const mockStore = getMockStore({});

describe('<SignInPage />', () => {
  let component;

  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <Router>
          <SignInPage />
        </Router>
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

  it('routes to sign up page', () => {
    mount(component).find('#signupButton').first().simulate('click');
  });

  it('rejects invalid sign in request', async () => {
    useDispatch.mockImplementation(() => () => Promise.reject());

    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value: 'user' } });
    wrapper.find('#passwordInput').simulate('change', { target: { value: 'pass' } });
    wrapper.find('#signinConfirmButton').first().simulate('click');
    await Promise.resolve();
  });

  it('accepts valid sign in request', async () => {
    useDispatch.mockImplementation(() => () => Promise.resolve());

    const wrapper = mount(component);
    wrapper.find('#usernameInput').simulate('change', { target: { value: 'user' } });
    wrapper.find('#passwordInput').simulate('change', { target: { value: 'pass' } });
    wrapper.find('#signinConfirmButton').first().simulate('click');
    await Promise.resolve();
  });

});