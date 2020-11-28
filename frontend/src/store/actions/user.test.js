import axios from 'axios';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import * as actionCreators from './user';


const initialState = {
  user: {
    isAuthorized: false,
    id: null,
    name: null,
    noti: null,
  }
};

const mockStore = createStore((state = initialState) => state, applyMiddleware(thunk));


describe('user action creators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('signin success', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve({ data: { user_id: 1, username: 'user 1' } }));

    await mockStore.dispatch(actionCreators.signin());
  });

  it('signin failure', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(() => Promise.reject());

    await mockStore.dispatch(actionCreators.signin());
  });

  it('checkUserStatus', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: { user_id: 1, username: 'user 1' } }));

    await mockStore.dispatch(actionCreators.checkUserStatus());
  });

  it('signout', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve());

    await mockStore.dispatch(actionCreators.signout());
  });

  it('notification', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: {  } }));

    await mockStore.dispatch(actionCreators.notification(1));
  });

  it('notification failure', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.reject());
    await mockStore.dispatch(actionCreators.notification(1));
  });
});