import * as actionTypes from '../actions/actionTypes';
import reducer from './user';


describe('user reducer', () => {
  it('SIGN_IN', () => {
    reducer(undefined, {
      type: actionTypes.SIGN_IN,
      id: 1,
      name: 'name 1',
    });
  });

  it('SIGN_OUT', () => {
    reducer(undefined, {
      type: actionTypes.SIGN_OUT,
    });
  });

  it('default', () => {
    reducer(undefined, {});
  });

  it('notification', () => {
    reducer(undefined, {
      type: actionTypes.GET_NOTIFICATION,
      noti: null
    });
  });
});