import { mount } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { SignInPage } from './SignInPage';


const mockStore = createStore(state => state);

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../store/actions/index', () => ({
  signin: jest.fn(),
}));


describe('<SignInPage />', () => {
  let component;

  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <SignInPage />
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
    expect(mockHistoryPush).toBeCalledWith('/signup');
  });

  it('rejects invalid sign in request', async () => {
    mockDispatch.mockImplementation(() => Promise.reject());
    window.alert = jest.fn();

    const wrapper = mount(component);
    wrapper.find('#signinConfirmButton').first().simulate('click');
    await Promise.resolve();
    expect(window.alert).toBeCalledWith('Authentication failed.');
  });

  it('accepts valid sign in request', async () => {
    mockDispatch.mockImplementation(() => Promise.resolve());

    const wrapper = mount(component);
    wrapper.find('#signinConfirmButton').first().simulate('click');
    await Promise.resolve();
    expect(mockHistoryPush).toBeCalledWith('/');
  });

});