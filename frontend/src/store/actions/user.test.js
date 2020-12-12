import axios from 'axios';

import * as actionCreators from './user';
import { getMockStore } from '../../test-utils/mocks';


const initialState = {
  user: {
    isAuthorized: false,
    id: null,
    name: null,
    noti: null,
    recommendation: null,
  }
};

const mockStore = getMockStore(initialState);

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

  it('user status authorized', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: { user_id: 1, username: 'user 1' } }));

    await mockStore.dispatch(actionCreators.checkUserStatus());
  });


  it('user status unauthorized', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.reject());

    await mockStore.dispatch(actionCreators.checkUserStatus());
  });

  it('signout', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve());

    await mockStore.dispatch(actionCreators.signout());
  });

  it('notification', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: {} }));

    await mockStore.dispatch(actionCreators.notification(1));
  });

  it('recommendation', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: {} }));
      
    await mockStore.dispatch(actionCreators.getRecommendation());
  });

});